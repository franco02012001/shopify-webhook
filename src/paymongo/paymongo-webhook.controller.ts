import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { OrderService } from '../order/order.service';
import { ShopifyService } from '../shopify/shopify.service';
import { PaymongoWebhookGuard } from './guards/paymongo-webhook.guard';

@Controller('webhooks/paymongo')
export class PaymongoWebhookController {
  constructor(
    private orderService: OrderService,
    private shopify: ShopifyService,
  ) {}

  @Post()
  @HttpCode(200)
  @UseGuards(PaymongoWebhookGuard)
  async handle(@Req() req: Request & { rawBody?: Buffer }) {
    if (!req.rawBody) return { ignored: true };
    const body = JSON.parse(req.rawBody.toString());
    const event = body.data;
    if (event.attributes.type !== 'payment.paid') return { ignored: true };

    const intentId = event.attributes.data.attributes.payment_intent_id;

    if (await this.orderService.isAlreadyPaid(intentId)) {
      return { duplicate: true };
    }

    const order = await this.orderService.findByIntentId(intentId);
    await this.shopify.resolvePaymentSession(order.sessionId);
    await this.orderService.markPaid(order.sessionId);
    return { processed: true };
  }
}
