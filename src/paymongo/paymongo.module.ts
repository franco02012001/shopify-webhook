import { Module, forwardRef } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { ShopifyModule } from '../shopify/shopify.module';
import { PaymongoCallbackController } from './paymongo-callback.controller';
import { PaymongoController } from './paymongo.controller';
import { PaymongoService } from './paymongo.service';
import { PaymongoWebhookController } from './paymongo-webhook.controller';
import { PaymongoWebhookGuard } from './guards/paymongo-webhook.guard';

@Module({
  imports: [OrderModule, forwardRef(() => ShopifyModule)],
  providers: [PaymongoService, PaymongoWebhookGuard],
  controllers: [PaymongoController, PaymongoCallbackController, PaymongoWebhookController],
  exports: [PaymongoService],
})
export class PaymongoModule {}
