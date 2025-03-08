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
}
