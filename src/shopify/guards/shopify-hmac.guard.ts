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
export class ShopifyHmacGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const shopifyHmac = req.headers['x-shopify-hmac-sha256'] as string;
    if (!shopifyHmac) throw new UnauthorizedException('Missing Shopify HMAC');

    const secret = this.config.get<string>('SHOPIFY_WEBHOOK_SECRET') ?? '';
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody?.toString() ?? '';
    const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');

    const given = Buffer.from(shopifyHmac, 'utf8');
    const expected = Buffer.from(hash, 'utf8');
    if (given.length !== expected.length) {
      throw new UnauthorizedException('Invalid Shopify HMAC');
    }

    if (!crypto.timingSafeEqual(given, expected)) {
      throw new UnauthorizedException('Invalid Shopify HMAC');
    }
    return true;
  }
}
