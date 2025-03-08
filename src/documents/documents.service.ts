import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/common/interfaces/custom-request';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}
  async handleFile(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
    req: CustomRequest,
  ) {
    try {
      const filePath = file.destination + '/' + file.filename;
      if (fs.existsSync(filePath)) {
        console.log('File uploaded:', file.filename);
        const newDocument = this.prisma.document.create({
          data: {
            title: createDocumentDto.title,
            description: createDocumentDto.description,
            filePath: file.filename,
            userId: req.user.id,
          },
        });
        return newDocument;
      }
      throw new InternalServerErrorException('Error in uploading document');
    } catch (error) {
      throw error;
    }
  }
  async updateFile(
    updateDocumentDto: UpdateDocumentDto,
    file: Express.Multer.File,
    req: CustomRequest,
    id: string,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('File required');
      }
      const document = await this.prisma.document.findUnique({
        where: {
          id: id,
        },
      });
      if (!document) {
        throw new BadRequestException('Document not fount.');
      }
      const filePath = file.destination + '/' + document.filePath;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('File updated:', file.filename);
        const updatedDocument = this.prisma.document.update({
          where: {
            id: id,
          },
          data: {
            title: updateDocumentDto.title,
            description: updateDocumentDto.description,
            filePath: file.filename,
            userId: req.user.id,
          },
        });
        return updatedDocument;
      }
      throw new InternalServerErrorException('Error in updating document');
    } catch (error) {
      throw error;
    }
  }
  async deleteDocument(id: string) {
    const document = await this.prisma.document.findUnique({
      where: {
        id: id,
      },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      document.filePath,
    );
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    fs.unlinkSync(filePath);
    return {
      message: 'Document deleted successfully',
    };
  }
}
