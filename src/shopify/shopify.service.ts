import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ShopifyService {
  constructor(private config: ConfigService) {}

  async resolvePaymentSession(sessionId: string) {
    return this.graphql(
      `
      mutation PaymentSessionResolve($id: ID!) {
        paymentSessionResolve(id: $id) {
          paymentSession { state { ... on PaymentSessionStateResolved { code } } }
          userErrors { field message }
        }
      }
    `,
      { id: sessionId },
    );
  }

  async rejectPaymentSession(sessionId: string, reason: string) {
    return this.graphql(
      `
      mutation PaymentSessionReject($id: ID!, $reason: PaymentSessionRejectionReasonInput!) {
        paymentSessionReject(id: $id, reason: $reason) {
          paymentSession { state { ... on PaymentSessionStateRejected { code } } }
          userErrors { field message }
        }
      }
    `,
      { id: sessionId, reason: { code: 'RISKY', merchantMessage: reason } },
    );
  }

  private async graphql(query: string, variables: object) {
    const domain = this.config.get('SHOPIFY_STORE_DOMAIN');
    const { data } = await axios.post(
      `https://${domain}/payments_apps/api/2024-01/graphql.json`,
      { query, variables },
      {
        headers: {
          'Shopify-API-Key': this.config.get('SHOPIFY_API_KEY'),
          'Content-Type': 'application/json',
        },
      },
    );
    return data;
  }
}
