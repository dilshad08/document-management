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

@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles('admin')
  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Roles('admin')
  @Put('role/:id')
  @ApiOperation({ summary: 'Update user role by id' })
  @ApiResponse({ status: 200, description: 'User details retrieved' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  async updateUserRole(
    @Param('id') userId: string,
    @Body() role: UpdateRoleDto,
  ) {
    return this.usersService.updateUserRole(userId, role.role);
  }
}
