import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterCommand } from '@/iam/application/commands/register/register.command';
import { LoginCommand } from '@/iam/application/commands/login/login.command';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.commandBus.execute(new RegisterCommand(dto.email, dto.password));
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.commandBus.execute(
      new LoginCommand(dto.email, dto.password),
    );
    return result;
  }
}
