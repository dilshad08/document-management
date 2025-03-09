import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CustomRequest } from '../common/interfaces/custom-request';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let documentsService: DocumentsService;

  // Mock DocumentsService
  const mockDocumentsService = {
    handleFile: jest.fn(),
    updateFile: jest.fn(),
    deleteDocument: jest.fn(),
    getDocuments: jest.fn(),
    getIngestionStatus: jest.fn(),
  };

  // Mock Express Multer file
  const mockFile = {
    originalname: 'test.pdf',
    filename: 'test.pdf',
    path: '/uploads/test.pdf',
    mimetype: 'application/pdf',
    size: 1024,
  } as Express.Multer.File;

  // Mock CustomRequest
  const mockRequest = {
    user: { id: '1', roles: ['admin'] },
  } as unknown as CustomRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        { provide: DocumentsService, useValue: mockDocumentsService },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock JwtAuthGuard
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard) // Mock RolesGuard
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DocumentsController>(DocumentsController);
    documentsService = module.get<DocumentsService>(DocumentsService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('uploadFile', () => {
    it('should upload a file and return success', async () => {
      const createDocumentDto: CreateDocumentDto = {
        title: 'Test Document',
        description: 'This is a test document',
      };

      const result = { id: '1', ...createDocumentDto, file: mockFile.filename };
      mockDocumentsService.handleFile.mockResolvedValue(result);

      const response = await controller.uploadFile(
        createDocumentDto,
        mockFile,
        mockRequest,
      );
      expect(response).toEqual(result);
      expect(documentsService.handleFile).toHaveBeenCalledWith(
        createDocumentDto,
        mockFile,
        mockRequest,
      );
    });
  });

  describe('updateFile', () => {
    it('should update a file and return success', async () => {
      const updateDocumentDto: UpdateDocumentDto = {
        title: 'Updated Document',
        description: 'This is an updated document',
      };

      const result = { id: '1', ...updateDocumentDto, file: mockFile.filename };
      mockDocumentsService.updateFile.mockResolvedValue(result);

      const response = await controller.updateFile(
        updateDocumentDto,
        mockFile,
        mockRequest,
        '1',
      );
      expect(response).toEqual(result);
      expect(documentsService.updateFile).toHaveBeenCalledWith(
        updateDocumentDto,
        mockFile,
        mockRequest,
        '1',
      );
    });
  });

  describe('downloadFile', () => {
    it('should download a file successfully', async () => {
      const filename = 'test.pdf';
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest.spyOn(require('fs'), 'createReadStream').mockReturnValue({
        pipe: jest.fn(),
      });

      await controller.downloadFile(filename, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        `attachment; filename=${filename}`,
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/octet-stream',
      );
    });

    it('should throw NotFoundException if file does not exist', async () => {
      const filename = 'nonexistent.pdf';
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);

      await expect(
        controller.downloadFile(filename, mockResponse),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file and return success', async () => {
      const result = { id: '1', message: 'Document deleted successfully' };
      mockDocumentsService.deleteDocument.mockResolvedValue(result);

      const response = await controller.deleteFile('1');
      expect(response).toEqual(result);
      expect(documentsService.deleteDocument).toHaveBeenCalledWith('1');
    });
  });

  describe('getDocuments', () => {
    it('should return a list of documents for the user', async () => {
      const result = [
        {
          id: '1',
          title: 'Test Document',
          description: 'This is a test document',
          file: 'test.pdf',
        },
      ];
      mockDocumentsService.getDocuments.mockResolvedValue(result);

      const response = await controller.getDocuments(mockRequest);
      expect(response).toEqual(result);
      expect(documentsService.getDocuments).toHaveBeenCalledWith('1');
    });
  });

  describe('getIngestionStatus', () => {
    it('should return the ingestion status of a document for the authenticated user', async () => {
      const documentId = '1';
      const userId = 'user-123';
      const mockRequest = {
        user: { id: userId },
      } as CustomRequest;

      const result = { id: documentId, status: 'completed', userId };
      mockDocumentsService.getIngestionStatus.mockResolvedValue(result);

      const response = await controller.getIngestionStatus(
        documentId,
        mockRequest,
      );
      expect(response).toEqual(result);
      expect(documentsService.getIngestionStatus).toHaveBeenCalledWith(
        documentId,
        userId,
      );
    });

    it('should throw an error if the document ingestion status cannot be retrieved', async () => {
      const documentId = '1';
      const userId = 'user-123';
      const mockRequest = {
        user: { id: userId },
      } as CustomRequest;

      mockDocumentsService.getIngestionStatus.mockRejectedValue(
        new Error('Failed to retrieve ingestion status'),
      );

      await expect(
        controller.getIngestionStatus(documentId, mockRequest),
      ).rejects.toThrow('Failed to retrieve ingestion status');
      expect(documentsService.getIngestionStatus).toHaveBeenCalledWith(
        documentId,
        userId,
      );
    });
  });
});
