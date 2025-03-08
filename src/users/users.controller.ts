// src/users/users.controller.ts
import { Controller, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  BaseCreatedResponseDto,
  BaseResponseDto,
} from 'src/common/response-dto/BaseResponseDto';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: BaseCreatedResponseDto })
  @ApiBody({ type: CreateUserDto })
  @Roles('admin')
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Update user role by id' })
  @ApiResponse({ status: 200, type: BaseResponseDto })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @Roles('admin')
  @Put('role/:id')
  async updateUserRole(
    @Param('id') userId: string,
    @Body() role: UpdateRoleDto,
  ) {
    return this.usersService.updateUserRole(userId, role.role);
  }
}
