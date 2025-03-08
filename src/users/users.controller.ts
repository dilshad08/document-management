// src/users/users.controller.ts
import { Controller, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateRoleDto } from './dto/update-role.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles('admin')
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Roles('admin')
  @Put('role/:id')
  async updateUserRole(
    @Param('id') userId: string,
    @Body() role: UpdateRoleDto,
  ) {
    return this.usersService.updateUserRole(userId, role.role);
  }
}
