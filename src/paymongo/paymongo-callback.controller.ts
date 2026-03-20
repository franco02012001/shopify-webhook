import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { OrderService } from '../order/order.service';
import { PaymentStatus } from '../order/schemas/order.schema';
import { ShopifyService } from '../shopify/shopify.service';
import { PaymongoService } from './paymongo.service';

@Controller('payment/callback')
export class PaymongoCallbackController {
  constructor(
    private paymongo: PaymongoService,
    private orderService: OrderService,
    private shopify: ShopifyService,
  ) {}

  @Get()
  async handle(@Query('payment_intent_id') intentId: string, @Res() res: Response) {
    const order = await this.orderService.findByIntentId(intentId);
    const intent = await this.paymongo.retrievePaymentIntent(intentId);
    const status = intent.attributes.status;

    if (status === 'succeeded') {
      await this.shopify.resolvePaymentSession(order.sessionId);
      await this.orderService.markPaid(order.sessionId);
      return res.redirect(order.returnUrl);
    }

    if (status === 'processing') {
      await this.orderService.updateStatus(order.sessionId, PaymentStatus.PROCESSING);
      return res.redirect(`${process.env.APP_URL}/payment/status?state=pending`);
    }

    await this.shopify.rejectPaymentSession(order.sessionId, 'Payment failed');
    await this.orderService.updateStatus(order.sessionId, PaymentStatus.FAILED);
    return res.redirect(`${process.env.APP_URL}/payment/status?state=failed`);
  }
}
