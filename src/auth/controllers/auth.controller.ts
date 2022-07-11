import { Body, Controller, HttpCode, Post, Put } from '@nestjs/common';
import {
  TypeResponse,
  TypeResponseError,
} from 'src/shared/types/response.type';
import { CreateUserDto } from '../../users/dto/createUsers.dto';
import { LoginCredentialsDto } from '../dto/LoginCredentialsDto';
import {
  RecoveryPassByEmailDto,
  RecoveryPassSendEmailDto,
} from '../dto/RecoveryPassByEmailDto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: CreateUserDto) {
    return await this.authService.signup(user);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() credentials: LoginCredentialsDto) {
    return await this.authService.login(credentials);
  }

  // envia el email para recuperaicon de password
  @HttpCode(200)
  @Post('rpbe')
  async recoveryPasswordSendEmail(@Body() recovery: RecoveryPassSendEmailDto) {
    return await this.authService.recoveryPasswordSendEmail(recovery.email);
  }

  // cambia el password de un user segun el token generado por recoveryPasswordSendEmail
  @HttpCode(200)
  @Put('rpbe')
  async recoveryPasswordByEmail(
    @Body() recovery: RecoveryPassByEmailDto,
  ): Promise<TypeResponse | TypeResponseError> {
    return await this.authService.recoveryPasswordByEmail(recovery);
  }
}
