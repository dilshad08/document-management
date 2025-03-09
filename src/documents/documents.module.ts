import { BadRequestException, Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    AuthModule,
    QueueModule,
    MulterModule.register({
      dest: './uploads',
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(pdf|docx|txt|csv)$/)) {
          return cb(
            new BadRequestException(
              'Only PDF, DOCX, and TXT files are allowed.',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, PrismaService],
})
export class DocumentsModule {}
