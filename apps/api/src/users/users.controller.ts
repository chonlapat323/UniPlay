import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: เปิด public ไว้ชั่วคราวทุก method (ยังไม่ได้สอนเรื่อง Login/JWT ให้นักเรียน)
  // พอถึงบทเรียน AUTH_GUIDE.md ต้องเอา @Public() ออกจาก findAll/findOne/update/remove
  // แล้วใส่ @ApiBearerAuth() กลับเข้าไปให้ตรงกับ SWAGGER_GUIDE.md อีกครั้ง
  @ApiOperation({ summary: 'สร้างสมาชิกใหม่' })
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'ดึงรายการสมาชิกทั้งหมด' })
  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'ดึงสมาชิกทีละคนตาม id' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'แก้ไขข้อมูลสมาชิก' })
  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'ลบสมาชิก' })
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
