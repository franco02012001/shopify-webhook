import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { PaymongoModule } from './paymongo/paymongo.module';
import { ShopifyModule } from './shopify/shopify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Support running from `shopify-paymongo` while .env is in parent workspace.
      envFilePath: ['.env', '../.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'dist'),
      // path-to-regexp v8 requires named wildcard params
      exclude: ['/payment', '/payment/*path', '/webhooks', '/webhooks/*path'],
    }),
    OrderModule,
    PaymongoModule,
    ShopifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
