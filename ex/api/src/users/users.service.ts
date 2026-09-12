import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private stripPassword<T extends { password: string }>(user: T) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.stripPassword(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return this.stripPassword(user);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      SALT_ROUNDS,
    );
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });
    return this.stripPassword(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // ให้ throw 404 ถ้าไม่เจอ ก่อนจะพยายาม update
    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    const user = await this.prisma.user.update({ where: { id }, data });

    return this.stripPassword(user);
  }

  async remove(id: string) {
    await this.findOne(id); // ให้ throw 404 ถ้าไม่เจอ ก่อนจะพยายามลบ
    const user = await this.prisma.user.delete({ where: { id } });
    return this.stripPassword(user);
  }
}
