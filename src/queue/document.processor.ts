import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Processor('document-queue')
export class DocumentProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }
  async process(job: any): Promise<void> {
    const { documentId, filePath } = job.data;
    console.log(`Processing document: ${documentId} with file: ${filePath}`);

    try {
      // Simulate processing (text extraction, embedding, etc.)
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await this.prisma.document.update({
        where: { id: documentId },
        data: { ingestionStatus: 'completed' },
      });

      console.log(`Document processing completed: ${documentId}`);
    } catch (error) {
      await this.prisma.document.update({
        where: { id: documentId },
        data: { ingestionStatus: 'failed' },
      });
      console.error(`Failed to process document: ${documentId}`, error);
    }
  }
}
