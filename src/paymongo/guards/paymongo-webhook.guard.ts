import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';

@Injectable()
export class PaymongoWebhookGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const sigHeader = req.headers['paymongo-signature'] as string;
    if (!sigHeader) throw new UnauthorizedException('Missing PayMongo signature');

    const parts = Object.fromEntries(sigHeader.split(',').map((p) => p.split('=')));
    const timestamp = parts.t;
    const signature = parts.li ?? parts.te;
    if (!timestamp || !signature) {
      throw new UnauthorizedException('Invalid PayMongo signature header');
    }

    const secret = this.config.get<string>('PAYMONGO_WEBHOOK_SECRET') ?? '';
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody?.toString() ?? '';
    const payload = `${timestamp}.${rawBody}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');
    if (signatureBuffer.length !== expectedBuffer.length) {
      throw new UnauthorizedException('Invalid PayMongo signature');
    }

    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      throw new UnauthorizedException('Invalid PayMongo signature');
    }
    return true;
  }
}
