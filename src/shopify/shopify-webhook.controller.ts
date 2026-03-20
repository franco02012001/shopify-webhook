import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { OrderService } from '../order/order.service';
import { PaymentStatus } from '../order/schemas/order.schema';
import { ShopifyHmacGuard } from './guards/shopify-hmac.guard';

@Controller('webhooks/shopify')
export class ShopifyWebhookController {
  constructor(private orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(ShopifyHmacGuard)
  async handle(@Req() req: Request & { rawBody?: Buffer }) {
    if (!req.rawBody) return { received: true };
    const topic = req.headers['x-shopify-topic'] as string;
    const body = JSON.parse(req.rawBody.toString());

    if (topic === 'orders/paid') {
      await this.orderService.updateStatus(String(body.id), PaymentStatus.PAID);
    }

    return { received: true };
  }
}
