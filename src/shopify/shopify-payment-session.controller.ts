import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PaymentStatus } from '../order/schemas/order.schema';
import { OrderService } from '../order/order.service';
import { PaymongoService } from '../paymongo/paymongo.service';

@Controller('payment')
export class ShopifyPaymentSessionController {
  constructor(
    private paymongo: PaymongoService,
    private orderService: OrderService,
  ) {}

  @Post('session/create')
  @HttpCode(200)
  async create(@Body() body: any) {
    const intent = await this.paymongo.createPaymentIntent(
      Number.parseFloat(body.amount),
      body.id,
    );
    await this.orderService.createOrUpdate({
      sessionId: body.id,
      amount: Number.parseFloat(body.amount),
      currency: body.currency ?? 'PHP',
      returnUrl: body.return_url,
      customerEmail: body.customer?.email,
      paymentIntentId: intent.id,
      status: PaymentStatus.PENDING,
      shopifyPayload: body,
    });

    const redirectUrl =
      `${process.env.APP_URL}/checkout?` +
      `intent_id=${intent.id}` +
      `&client_key=${intent.attributes.client_key}` +
      `&session_id=${encodeURIComponent(body.id)}` +
      `&return_url=${encodeURIComponent(body.return_url)}`;

    return { redirect_url: redirectUrl };
  }

  @Post('session/resolve')
  @HttpCode(200)
  resolve() {
    return {};
  }

  @Post('session/reject')
  @HttpCode(200)
  reject() {
    return {};
  }

  @Post('session/refund')
  @HttpCode(200)
  refund() {
    return {};
  }

  @Post('session/capture')
  @HttpCode(200)
  capture() {
    return {};
  }
}
