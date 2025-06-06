# ApexEasy - Simplified API

ApexEasy is a simplified wrapper around the Apex Omni API that makes it incredibly easy to interact with both public and private endpoints.

## Quick Start

### Public API (No Authentication)

```javascript
const { ApexEasy } = require('apex-omni-api');

// Create a public client
const apex = ApexEasy.public();

// Get price
const btcPrice = await apex.getPrice('BTC-USDT');
console.log(`BTC: $${btcPrice.price}`);

// Get all prices
const allPrices = await apex.getAllPrices();
console.log(allPrices);

// Watch price changes
const stop = await apex.watchPrice('ETH-USDT', (err, price) => {
    console.log(`ETH: $${price.price}`);
}, 5000); // Update every 5 seconds

// Stop watching later
stop();
```

### Private API (With Authentication)

```javascript
const { ApexEasy } = require('apex-omni-api');

// Create authenticated client
const apex = ApexEasy.authenticated(apiKey, apiSecret, passphrase);

// Or authenticate later
const apex = new ApexEasy();
apex.authenticate(apiKey, apiSecret, passphrase);

// Get account summary
const account = await apex.getAccountSummary();
console.log(`Balance: $${account.balance.available}`);

// Place orders
const order = await apex.placeLimitOrder('BTC-USDT', 'buy', 0.001, 50000);
const marketOrder = await apex.placeMarketOrder('ETH-USDT', 'sell', 0.1);

// Get orders and trades
const orders = await apex.getMyOrders();
const trades = await apex.getMyTrades();

// Cancel orders
await apex.cancelOrder(orderId);
await apex.cancelAllOrders('BTC-USDT');
```

## Features

### 🚀 Easy to Use
- Simple, intuitive API
- Automatic retry on failure
- Formatted responses
- Built-in error handling

### 📊 Public Market Data
- `getPrice(symbol)` - Get current price with bid/ask
- `getAllPrices()` - Get all market prices at once
- `getOrderBook(symbol, depth)` - Get order book with spread
- `watchPrice(symbol, callback, interval)` - Monitor price changes
- `calculatePositionSize(symbol, usdValue)` - Calculate how much you can buy

### 🔐 Private Account Management
- `getAccountSummary()` - Complete account overview
- `placeLimitOrder(symbol, side, size, price)` - Place limit orders
- `placeMarketOrder(symbol, side, size)` - Place market orders
- `getMyOrders()` - Get all open orders
- `getMyTrades(symbol, limit)` - Get trade history
- `cancelOrder(orderId)` - Cancel specific order
- `cancelAllOrders(symbol)` - Cancel all or symbol-specific orders

### 🛡️ Built-in Safety
- Automatic retry with exponential backoff
- Proper error handling
- Type conversion and validation
- Rate limit awareness

## Response Formats

All responses are formatted for easy use:

### Price Data
```javascript
{
    symbol: 'BTC-USDT',
    price: 65000.50,
    bid: 64999.00,
    ask: 65001.00,
    volume24h: 1234567.89,
    change24h: 2.45,
    high24h: 66000.00,
    low24h: 64000.00
}
```

### Account Summary
```javascript
{
    userId: '12345',
    email: 'user@example.com',
    balance: {
        total: 10000.00,
        available: 8000.00,
        inPositions: 2000.00,
        unrealizedPnl: -50.00
    },
    positions: [...],
    openOrders: 3
}
```

### Order Response
```javascript
{
    orderId: '123456',
    symbol: 'BTC-USDT',
    side: 'buy',
    price: 50000.00,
    size: 0.001,
    status: 'open',
    createdAt: Date
}
```

## Examples

See the `examples` directory for complete examples:
- `easy-public.js` - Public API examples
- `easy-private.js` - Private API examples
- `trading-bot-simple.js` - Simple grid trading bot

## Configuration

### Retry Settings
```javascript
const apex = new ApexEasy({
    retryAttempts: 3,      // Number of retry attempts
    retryDelay: 1000,      // Initial retry delay in ms
    apiKey: 'your-key',
    apiSecret: 'your-secret',
    passphrase: 'your-pass'
});
```

## Error Handling

ApexEasy provides clear error messages:

```javascript
try {
    const order = await apex.placeLimitOrder('BTC-USDT', 'buy', 0.001, 50000);
} catch (error) {
    if (error.message.includes('401')) {
        console.error('Invalid API credentials');
    } else if (error.message.includes('insufficient balance')) {
        console.error('Not enough funds');
    } else {
        console.error('Error:', error.message);
    }
}
```

## Tips

1. **Start with public endpoints** - No authentication needed
2. **Use `watchPrice`** for real-time monitoring
3. **Check `getAccountSummary()`** before trading
4. **Always handle errors** in production code
5. **Respect rate limits** - ApexEasy has built-in retry logic

## Support

Created by **Job Wiegant** of [RocketFlow](https://rocketflow.nl)

If you find ApexEasy helpful:
☕ [Buy Me a Coffee](https://coff.ee/jobwiegant)