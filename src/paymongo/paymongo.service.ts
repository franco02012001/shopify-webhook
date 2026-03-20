import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymongoService {
  private readonly baseUrl = 'https://api.paymongo.com/v1';
  private readonly secretKey: string;

  constructor(private config: ConfigService) {
    this.secretKey = this.config.get<string>('PAYMONGO_SECRET_KEY') ?? '';
  }

  private get authHeader(): string {
    return `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`;
  }

  async createPaymentIntent(amountPHP: number, orderId: string) {
    const amountCentavos = Math.round(amountPHP * 100);
    try {
      const { data } = await axios.post(
        `${this.baseUrl}/payment_intents`,
        {
          data: {
            attributes: {
              amount: amountCentavos,
              currency: 'PHP',
              payment_method_allowed: ['gcash', 'card', 'paymaya', 'grab_pay'],
              description: `Order ${orderId}`,
              metadata: { shopify_order_id: orderId },
            },
          },
        },
        { headers: { Authorization: this.authHeader } },
      );
      return data.data;
    } catch (err: any) {
      throw new HttpException(
        err.response?.data ?? 'PayMongo error',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async attachPaymentMethod(
    intentId: string,
    clientKey: string,
    type: string,
    returnUrl: string,
  ) {
    const pmRes = await axios.post(
      `${this.baseUrl}/payment_methods`,
      { data: { attributes: { type } } },
      { headers: { Authorization: this.authHeader } },
    );
    const paymentMethodId = pmRes.data.data.id;

    const attachRes = await axios.post(
      `${this.baseUrl}/payment_intents/${intentId}/attach`,
      {
        data: {
          attributes: {
            payment_method: paymentMethodId,
            client_key: clientKey,
            return_url: returnUrl,
          },
        },
      },
      { headers: { Authorization: this.authHeader } },
    );
    const intent = attachRes.data.data;
    return {
      status: intent.attributes.status,
      redirectUrl: intent.attributes.next_action?.redirect?.url ?? null,
    };
  }

  async retrievePaymentIntent(intentId: string) {
    const { data } = await axios.get(`${this.baseUrl}/payment_intents/${intentId}`, {
      headers: { Authorization: this.authHeader },
    });
    return data.data;
  }
}
