import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  Put,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomRequest } from 'src/common/interfaces/custom-request';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BaseCreatedResponseDto,
  BaseResponseDto,
} from 'src/common/response-dto/BaseResponseDto';
import { diskStorage } from 'multer';
import { getDestination, getFilename } from 'src/common/helper';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiOperation({ summary: 'Upload a document' })
  @ApiResponse({ status: 201, type: BaseCreatedResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file format' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins and editors allowed',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload document with metadata',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The document file to upload',
        },
        title: {
          type: 'string',
          example: 'Project Report',
          description: 'Title of the document',
        },
        description: {
          type: 'string',
          example: 'Annual project report document',
          description: 'Short description of the document',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: getDestination,
        filename: getFilename,
      }),
    }),
  )
  async uploadFile(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: CustomRequest,
  ) {
    return this.documentsService.handleFile(createDocumentDto, file, req);
  }

  @ApiOperation({ summary: 'Update a document' })
  @ApiResponse({ status: 200, type: BaseResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file format' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins and editors allowed',
  })
  @ApiParam({ name: 'id', required: true, description: 'Document ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload document with metadata',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The document file to upload',
        },
        title: {
          type: 'string',
          example: 'Project Report',
          description: 'Title of the document',
        },
        description: {
          type: 'string',
          example: 'Annual project report document',
          description: 'Short description of the document',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @Put('update/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: getDestination,
        filename: getFilename,
      }),
    }),
  )
  async updateFile(
    @Body() updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: CustomRequest,
    @Param('id') id: string,
  ) {
    return this.documentsService.updateFile(updateDocumentDto, file, req, id);
  }

  @ApiOperation({ summary: 'Download a file' })
  @ApiParam({
    name: 'filename',
    type: String,
    description: 'The name of the file to download',
  })
  @ApiResponse({
    status: 200,
    type: BaseResponseDto,
    description: 'File downloaded successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Roles('admin', 'editor', 'viewer')
  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Document not found');
      }

      // Set the appropriate headers for downloading
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-Type', 'application/octet-stream');

      // Stream the file to the client
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.log('Error downloading file.');
      res.status(500).send('Internal server error');
    }
  }

  @ApiOperation({ summary: 'Delete a file by its ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the file to delete',
  })
  @ApiResponse({
    status: 200,
    type: BaseResponseDto,
    description: 'File deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Roles('admin', 'editor')
  @Delete('delete/:id')
  async deleteFile(@Param('id') id: string) {
    return await this.documentsService.deleteDocument(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getDocuments(@Req() req: CustomRequest) {
    return this.documentsService.getDocuments(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('ingestion-status/:id')
  async getIngestionStatus(@Param('id') documentId: string) {
    return this.documentsService.getIngestionStatus(documentId);
  }
}
