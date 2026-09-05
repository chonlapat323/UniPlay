import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: เปิด public ไว้ชั่วคราวเพื่อ bootstrap user แรกได้ก่อนมี token
  // พอทำ RBAC (PermissionsGuard) เสร็จ ต้องเปลี่ยนเป็นจำกัดสิทธิ์เฉพาะ Staff/Admin เท่านั้น
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
