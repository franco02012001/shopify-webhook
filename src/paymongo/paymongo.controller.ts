import { Body, Controller, Post } from '@nestjs/common';
import { PaymongoService } from './paymongo.service';

@Controller('payment')
export class PaymongoController {
  constructor(private readonly paymongoService: PaymongoService) {}

  @Post('attach')
  async attach(
    @Body()
    body: {
      intentId: string;
      clientKey: string;
      paymentMethod: string;
      returnUrl: string;
    },
  ) {
    return this.paymongoService.attachPaymentMethod(
      body.intentId,
      body.clientKey,
      body.paymentMethod,
      body.returnUrl,
    );
  }
}
