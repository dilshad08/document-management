import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser({ email, name, password, role }: CreateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
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
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUserRole(userId: string, role: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: { role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
