import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, PaymentStatus } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createOrUpdate(data: Partial<Order>): Promise<OrderDocument> {
    return this.orderModel.findOneAndUpdate(
      { sessionId: data.sessionId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  }

  async findBySessionId(sessionId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({ sessionId });
    if (!order) throw new NotFoundException(`Order not found: ${sessionId}`);
    return order;
  }

  async findByIntentId(paymentIntentId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({ paymentIntentId });
    if (!order) throw new NotFoundException(`Order not found: ${paymentIntentId}`);
    return order;
  }

  async updateStatus(sessionId: string, status: PaymentStatus): Promise<void> {
    await this.orderModel.updateOne({ sessionId }, { $set: { status } });
  }

  async markPaid(sessionId: string): Promise<void> {
    await this.orderModel.updateOne(
      { sessionId },
      { $set: { status: PaymentStatus.PAID } },
    );
  }

  async isAlreadyPaid(paymentIntentId: string): Promise<boolean> {
    const count = await this.orderModel.countDocuments({
      paymentIntentId,
      status: PaymentStatus.PAID,
    });
    return count > 0;
  }

  async findAll(status?: PaymentStatus, limit = 50): Promise<OrderDocument[]> {
    const filter = status ? { status } : {};
    return this.orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec() as unknown as Promise<OrderDocument[]>;
  }
}
