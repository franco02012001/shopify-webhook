import { Module, forwardRef } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { PaymongoModule } from '../paymongo/paymongo.module';
import { ShopifyHmacGuard } from './guards/shopify-hmac.guard';
import { ShopifyPaymentSessionController } from './shopify-payment-session.controller';
import { ShopifyService } from './shopify.service';
import { ShopifyWebhookController } from './shopify-webhook.controller';

@Module({
  imports: [OrderModule, forwardRef(() => PaymongoModule)],
  providers: [ShopifyService, ShopifyHmacGuard],
  controllers: [ShopifyPaymentSessionController, ShopifyWebhookController],
  exports: [ShopifyService],
})
export class ShopifyModule {}
