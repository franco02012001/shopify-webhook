import { useState } from 'react';
import { Banner, Badge, BlockStack, Button, Card, InlineStack, Page, Text } from '@shopify/polaris';
import { useSearchParams } from 'react-router-dom';
import { apiUrl } from '../config';

const METHODS = [
  { id: 'gcash', label: 'GCash', icon: '💚', eta: 'Instant' },
  { id: 'card', label: 'Credit / Debit card', icon: '💳', eta: 'Instant' },
  { id: 'paymaya', label: 'Maya', icon: '🔵', eta: '1-2 mins' },
  { id: 'grab_pay', label: 'GrabPay', icon: '🟢', eta: '1-2 mins' },
];

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const intentId = params.get('intent_id');
  const clientKey = params.get('client_key');
  const sessionId = params.get('session_id');
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/payment/attach'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intentId,
          clientKey,
          sessionId,
          paymentMethod: selected,
          returnUrl: `${window.location.origin}/payment/callback`,
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) window.location.href = data.redirectUrl;
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <Page title="Checkout" subtitle="Select payment method for PayMongo">
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Available methods
              </Text>
              <Badge tone="info">Secured by PayMongo</Badge>
            </InlineStack>

            {METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelected(method.id)}
                style={{
                  border: selected === method.id ? '2px solid #005bd3' : '1px solid #dfe3e8',
                  borderRadius: 12,
                  background: selected === method.id ? '#f2f7ff' : 'white',
                  padding: 12,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <InlineStack align="space-between">
                  <InlineStack gap="200">
                    <Text as="span">{method.icon}</Text>
                    <BlockStack gap="100">
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        {method.label}
                      </Text>
                      <Text as="p" tone="subdued">
                        Expected confirmation: {method.eta}
                      </Text>
                    </BlockStack>
                  </InlineStack>
                  {selected === method.id ? <Badge tone="info">Selected</Badge> : null}
                </InlineStack>
              </button>
            ))}

            {error ? <Banner tone="critical">{error}</Banner> : null}

            <InlineStack align="end">
              <Button onClick={handlePay} disabled={!selected || loading} variant="primary">
                {loading ? 'Redirecting...' : 'Continue to payment'}
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">
            <Text as="h3" variant="headingSm">
              Session details
            </Text>
            <Text as="p" tone="subdued">
              Session ID: {sessionId ?? 'Unavailable'}
            </Text>
            <Text as="p" tone="subdued">
              Intent ID: {intentId ?? 'Unavailable'}
            </Text>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
