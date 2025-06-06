# Usage Guide for apex-omni-api

## Installation

```bash
npm install apex-omni-api
```

## Testing Your Setup

After installation, you can verify your setup:

```javascript
const { testSetup } = require('apex-omni-api');

// Test public API only
await testSetup();

// Test with credentials
await testSetup(
    'your-api-key',
    'your-api-secret',
    'your-passphrase'
);
```

## Basic Usage

```javascript
const ApexOmniClient = require('apex-omni-api');

// Initialize the client with your API credentials
const client = new ApexOmniClient(
    'your-api-key',
    'your-api-secret', 
    'your-passphrase'
);

// Example: Get server time (public endpoint)
const time = await client.getTime();
console.log('Server time:', time);

// Example: Get your account balance (requires authentication)
const balance = await client.getAccountBalance();
console.log('Account balance:', balance);

// Example: Get market data
const ticker = await client.getTicker('BTC-USDT');
console.log('BTC-USDT ticker:', ticker);

// Example: Place an order
const order = await client.createOrder({
    symbol: 'BTC-USDT',
    side: 'buy',
    type: 'limit',
    size: '0.001',
    price: '50000'
});
console.log('Order placed:', order);
```

## Getting API Credentials

1. Visit https://omni.apex.exchange
2. Register an account or login
3. Navigate to API settings
4. Create a new API key with appropriate permissions
5. Store your credentials securely

## Available Methods

### Public Endpoints (No Authentication Required)
- `getTime()` - Get server time
- `getSymbols()` - Get all trading pairs
- `getTicker(symbol)` - Get ticker for a symbol
- `getOrderBook(symbol, limit)` - Get order book

### Private Endpoints (Authentication Required)
- `getUser()` - Get user information
- `getAccount()` - Get account details and positions
- `getAccountBalance()` - Get account balance
- `getOpenOrders()` - Get all open orders
- `getHistoryOrders(params)` - Get order history
- `getFills(params)` - Get trade history
- `createOrder(params)` - Create a new order
- `cancelOrder(orderId)` - Cancel an order
- `cancelAllOrders(symbol)` - Cancel all orders

## Error Handling

```javascript
try {
    const balance = await client.getAccountBalance();
    console.log(balance);
} catch (error) {
    console.error('API Error:', error.message);
}
```

## Support

For issues or questions, visit: https://github.com/RocketFlowNL/apex-omni-api-nodejs/issues