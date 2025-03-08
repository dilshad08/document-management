import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/common/interfaces/custom-request';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}
  async handleFile(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
    req: CustomRequest,
  ) {
    try {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        file.filename,
      );
      const fileExtension = path.extname(file.originalname);
      const fileNameWithExtension = `${file.filename}${fileExtension}`;
      if (fs.existsSync(filePath)) {
        console.log('File uploaded:', fileNameWithExtension);
        const newDocument = this.prisma.document.create({
          data: {
            title: createDocumentDto.title,
            description: createDocumentDto.description,
            filePath: fileNameWithExtension,
            userId: req.user.id,
          },
        });
        return newDocument;
      }
      throw new InternalServerErrorException('Error in uploading file');
    } catch (error) {
      throw new InternalServerErrorException('Error in uploading file');
    }
  }
}
