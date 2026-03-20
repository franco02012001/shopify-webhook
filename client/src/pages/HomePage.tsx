import { Badge, BlockStack, Box, Button, Card, InlineStack, List, Page, Text } from '@shopify/polaris';

export default function HomePage() {
  return (
    <Page title="PayMongo Gateway" subtitle="Shopify payment app dashboard">
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Payment operations
              </Text>
              <Badge tone="success">Live ready</Badge>
            </InlineStack>
            <Text as="p" tone="subdued">
              Accept GCash, Maya, GrabPay, and card payments using PayMongo. This app handles Shopify session
              creation, callback processing, and webhook updates.
            </Text>
            <Box>
              <a href="/checkout" style={{ textDecoration: 'none' }}>
                <Button variant="primary">Open checkout demo</Button>
              </a>
            </Box>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">
            <Text as="h3" variant="headingSm">
              Capabilities
            </Text>
            <List type="bullet">
              <List.Item>One flow for wallets and cards</List.Item>
              <List.Item>Webhook-based status updates to Shopify</List.Item>
              <List.Item>Secure payment verification and callback handling</List.Item>
            </List>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
