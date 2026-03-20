import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true, index: true })
  sessionId: string;

  @Prop({ index: true })
  shopifyOrderId: string;

  @Prop({ unique: true, sparse: true, index: true })
  paymentIntentId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'PHP' })
  currency: string;

  @Prop({ required: true })
  returnUrl: string;

  @Prop()
  customerEmail: string;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    index: true,
  })
  status: PaymentStatus;

  @Prop({ type: Object })
  paymongoResponse: Record<string, unknown>;

  @Prop({ type: Object })
  shopifyPayload: Record<string, unknown>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
