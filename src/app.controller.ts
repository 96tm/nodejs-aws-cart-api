import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { LocalAuthGuard, AuthService, BasicAuthGuard } from './auth';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Get(['', 'ping'])
  healthCheck(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('api/auth/login')
  async login(@Request() req, @Res() res) {
    const token = this.authService.login(req.user, 'basic');
    const statusCode = HttpStatus.OK;
    return res.status(statusCode).json({
      statusCode,
      message: 'OK',
      data: {
        ...token,
      },
    });
  }

  @UseGuards(BasicAuthGuard)
  @Get('api/profile')
  async getProfile(@Request() req) {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        user: req.user,
      },
    };
  }
}
