
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '2m' },
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AuthModule {}
