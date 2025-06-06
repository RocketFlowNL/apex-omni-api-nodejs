# API Reference

Complete API documentation for apex-omni-api.

## Class: ApexOmniClient

### Constructor

```javascript
new ApexOmniClient(apiKey, apiSecret, passphrase)
```

Creates a new instance of the Apex Omni API client.

**Parameters:**
- `apiKey` (string) - Your Apex API key
- `apiSecret` (string) - Your Apex API secret
- `passphrase` (string) - Your Apex API passphrase

**Example:**
```javascript
const client = new ApexOmniClient(
    'your-api-key',
    'your-api-secret',
    'your-passphrase'
);
```

## Public Methods (No Authentication Required)

### getTime()

Get the current server time.

**Returns:** `Promise<Object>`
- `data.time` (number) - Server timestamp in milliseconds
- `timeCost` (number) - Request processing time

**Example:**
```javascript
const response = await client.getTime();
console.log('Server time:', new Date(response.data.time));
```

### getSymbols()

Get all available trading symbols.

**Returns:** `Promise<Object>`
- `data` (Array) - List of trading symbol objects

**Example:**
```javascript
const response = await client.getSymbols();
response.data.forEach(symbol => {
    console.log(symbol.symbol, symbol.status);
});
```

### getTicker(symbol)

Get ticker information for a specific symbol.

**Parameters:**
- `symbol` (string) - Trading pair symbol (e.g., 'BTC-USDT')

**Returns:** `Promise<Object>`
- `data` - Ticker data including price, volume, etc.

**Example:**
```javascript
const ticker = await client.getTicker('BTC-USDT');
console.log('BTC Price:', ticker.data.lastPrice);
```

### getOrderBook(symbol, limit)

Get order book depth for a symbol.

**Parameters:**
- `symbol` (string) - Trading pair symbol
- `limit` (number, optional) - Number of price levels (default: 100)

**Returns:** `Promise<Object>`
- `data.asks` (Array) - Ask orders [price, quantity]
- `data.bids` (Array) - Bid orders [price, quantity]

**Example:**
```javascript
const orderBook = await client.getOrderBook('BTC-USDT', 50);
console.log('Best ask:', orderBook.data.asks[0]);
console.log('Best bid:', orderBook.data.bids[0]);
```

## Private Methods (Authentication Required)

### getUser()

Get user account information.

**Returns:** `Promise<Object>`
- `data.userId` - User ID
- `data.email` - User email
- Additional user details

**Example:**
```javascript
const user = await client.getUser();
console.log('User ID:', user.data.userId);
```

### getAccount()

Get detailed account information including positions.

**Returns:** `Promise<Object>`
- `data` - Account details including open positions

**Example:**
```javascript
const account = await client.getAccount();
console.log('Open positions:', account.data.openPositions);
```

### getAccountBalance()

Get account balance and PnL information.

**Returns:** `Promise<Object>`
- `data.totalEquityValue` - Total account value
- `data.availableBalance` - Available balance for trading
- `data.totalPositionValue` - Value of open positions

**Example:**
```javascript
const balance = await client.getAccountBalance();
console.log('Available balance:', balance.data.availableBalance);
```

### getOpenOrders()

Get all open orders.

**Returns:** `Promise<Object>`
- `data` (Array) - List of open order objects

**Example:**
```javascript
const orders = await client.getOpenOrders();
orders.data.forEach(order => {
    console.log(`Order ${order.id}: ${order.side} ${order.size} @ ${order.price}`);
});
```

### getHistoryOrders(params)

Get historical orders.

**Parameters:**
- `params` (Object, optional)
  - `symbol` (string) - Filter by symbol
  - `status` (string) - Filter by status
  - `limit` (number) - Number of records (default: 100)
  - `page` (number) - Page number

**Returns:** `Promise<Object>`
- `data` (Array) - List of historical orders

**Example:**
```javascript
const history = await client.getHistoryOrders({
    symbol: 'BTC-USDT',
    limit: 50
});
```

### getFills(params)

Get trade history (filled orders).

**Parameters:**
- `params` (Object, optional)
  - `symbol` (string) - Filter by symbol
  - `limit` (number) - Number of records
  - `page` (number) - Page number

**Returns:** `Promise<Object>`
- `data` (Array) - List of filled trades

**Example:**
```javascript
const fills = await client.getFills({ symbol: 'BTC-USDT' });
fills.data.forEach(fill => {
    console.log(`Filled: ${fill.size} @ ${fill.price}`);
});
```

### createOrder(params)

Create a new order.

**Parameters:**
- `params` (Object)
  - `symbol` (string, required) - Trading pair
  - `side` (string, required) - 'buy' or 'sell'
  - `type` (string, required) - 'limit' or 'market'
  - `size` (string, required) - Order quantity
  - `price` (string, required for limit orders) - Order price
  - `clientOrderId` (string, optional) - Custom order ID
  - `timeInForce` (string, optional) - 'GTC', 'IOC', 'FOK'

**Returns:** `Promise<Object>`
- `data` - Created order details

**Example:**
```javascript
const order = await client.createOrder({
    symbol: 'BTC-USDT',
    side: 'buy',
    type: 'limit',
    size: '0.001',
    price: '50000',
    timeInForce: 'GTC'
});
console.log('Order ID:', order.data.id);
```

### cancelOrder(orderId)

Cancel a specific order.

**Parameters:**
- `orderId` (string) - The order ID to cancel

**Returns:** `Promise<Object>`
- `data` - Cancelled order details

**Example:**
```javascript
const result = await client.cancelOrder('order-123456');
console.log('Cancelled order:', result.data.id);
```

### cancelAllOrders(symbol)

Cancel all open orders, optionally filtered by symbol.

**Parameters:**
- `symbol` (string, optional) - Cancel only orders for this symbol

**Returns:** `Promise<Object>`
- `data` - List of cancelled orders

**Example:**
```javascript
// Cancel all orders
await client.cancelAllOrders();

// Cancel only BTC-USDT orders
await client.cancelAllOrders('BTC-USDT');
```

## Error Handling

All methods may throw errors. Always use try-catch blocks:

```javascript
try {
    const balance = await client.getAccountBalance();
    console.log(balance);
} catch (error) {
    if (error.message.includes('401')) {
        console.error('Authentication failed');
    } else if (error.message.includes('429')) {
        console.error('Rate limit exceeded');
    } else {
        console.error('API Error:', error.message);
    }
}
```

## Rate Limits

The Apex Omni API has rate limits. If you exceed them, you'll receive a 429 error. Implement appropriate retry logic and respect the limits.

## WebSocket Support

This package currently supports REST API only. WebSocket support may be added in future versions.