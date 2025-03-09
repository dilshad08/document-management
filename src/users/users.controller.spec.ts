import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  // Mock implementations
  const mockUsersService = {
    createUser: jest.fn(),
    updateUserRole: jest.fn(),
  };

  const mockAuthService = {
    // Add methods if needed
  };

  const mockPrismaService = {
    // Add methods if needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock JwtAuthGuard
      .useValue({ canActivate: () => true })
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
        role: 'user',
      };

      const createdUser = {
        id: '1',
        ...createUserDto,
      };

      mockUsersService.createUser.mockResolvedValue(createdUser);

      const result = await usersController.register(createUserDto);
      expect(result).toEqual(createdUser);
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUserRole', () => {
    it('should update the role of a user', async () => {
      const userId = '1';
      const updateRoleDto: UpdateRoleDto = { role: 'admin' };

      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      };

      mockUsersService.updateUserRole.mockResolvedValue(updatedUser);

      const result = await usersController.updateUserRole(
        userId,
        updateRoleDto,
      );
      expect(result).toEqual(updatedUser);
      expect(usersService.updateUserRole).toHaveBeenCalledWith(
        userId,
        updateRoleDto.role,
      );
    });
  });
});
