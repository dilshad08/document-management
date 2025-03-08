// src/users/users.service.ts
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser({ email, name, password, role }: CreateUserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (user) {
        throw new BadRequestException('User already exist');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      return this.prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
