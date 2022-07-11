import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { NotifyModule } from '../notify/notity.module';
// import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    // PassportModule,
    JwtModule.register({
      secret: 'API_KEY', // FIXME: agregar en config auth,, no lo toma desde el process.env.API_KEY por alguna razon
      signOptions: { expiresIn: '1day' }, // FIXME: agregar en config auth
    }),
    NotifyModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
