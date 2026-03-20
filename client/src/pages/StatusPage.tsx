import { Badge, BlockStack, Box, Button, Card, Page, Text } from '@shopify/polaris';
import { useSearchParams } from 'react-router-dom';

const STATES = {
  success: {
    badge: 'Completed',
    title: 'Payment successful',
    msg: 'Your order is confirmed. Check your email.',
    cta: 'Continue shopping',
    tone: 'success' as const,
    href: '/',
  },
  failed: {
    badge: 'Failed',
    title: 'Payment failed',
    msg: 'Your payment could not be processed. No charges were made.',
    cta: 'Try again',
    tone: 'critical' as const,
    href: '/checkout',
  },
  pending: {
    badge: 'Pending',
    title: 'Payment pending',
    msg: 'Waiting for confirmation from your bank or wallet.',
    cta: 'Check order status',
    tone: 'warning' as const,
    href: '/',
  },
};

export default function StatusPage() {
  const [params] = useSearchParams();
  const state = (params.get('state') ?? 'pending') as keyof typeof STATES;
  const s = STATES[state] ?? STATES.pending;

  return (
    <Page title="Payment status">
      <Card>
        <BlockStack gap="300">
          <Badge tone={s.tone}>{s.badge}</Badge>
          <Text as="h2" variant="headingMd">
            {s.title}
          </Text>
          <Text as="p" tone="subdued">
            {s.msg}
          </Text>
          <Box>
            <a href={s.href} style={{ textDecoration: 'none' }}>
              <Button variant="primary">{s.cta}</Button>
            </a>
          </Box>
        </BlockStack>
      </Card>
    </Page>
  );
}
