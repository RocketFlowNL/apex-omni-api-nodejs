# Apex Omni API Client (Node.js)

[![npm version](https://badge.fury.io/js/apex-omni-api.svg)](https://www.npmjs.com/package/apex-omni-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/apex-omni-api.svg)](https://nodejs.org)

A Node.js client library for interacting with the Apex Omni exchange API.

## Author

Created by Job Wiegant of RocketFlow  
Email: job@rocketflow.nl

## Support

If you find this project helpful, consider buying me a coffee!  
☕ [Buy Me a Coffee](https://coff.ee/jobwiegant)

## Documentation

- [Usage Guide](./USAGE.md) - Detailed usage examples
- [API Reference](./API.md) - Complete API documentation
- [ApexEasy Guide](./EASY.md) - Simplified API wrapper
- [Contributing](./CONTRIBUTING.md) - How to contribute
- [Testing](./TESTING.md) - Testing guidelines
- [Changelog](./CHANGELOG.md) - Version history

## Installation

```bash
npm install apex-omni-api
```

## Quick Start

### Option 1: Using ApexEasy (Recommended)

```javascript
const { ApexEasy } = require('apex-omni-api');

// Public API (no auth needed)
const apex = ApexEasy.public();
const btcPrice = await apex.getPrice('BTC-USDT');
console.log(`BTC: $${btcPrice.price}`);

// Private API
const apex = ApexEasy.authenticated(apiKey, apiSecret, passphrase);
const account = await apex.getAccountSummary();
console.log(`Balance: $${account.balance.available}`);
```

### Option 2: Using Direct Client

```javascript
const ApexOmniClient = require('apex-omni-api');

// Initialize the client
const client = new ApexOmniClient(
    'your-api-key',
    'your-api-secret',
    'your-passphrase'
);

// Example: Get server time
const time = await client.getTime();
console.log('Server time:', time);
```

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/RocketFlowNL/apex-omni-api-nodejs.git
   cd apex-omni-api-nodejs
   npm install
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Add your credentials to `.env`:
   - `ETH_PRIVATE_KEY` - Your Ethereum private key
   - `APEX_API_KEY` - Your Apex API key
   - `APEX_API_SECRET` - Your Apex API secret
   - `APEX_API_PASSPHRASE` - Your Apex API passphrase
   - `APEX_ACCOUNT_ID` - Your Apex account ID

## Getting API Credentials from Browser

If you already have an Apex Omni account, you can extract your API credentials from Chrome's local storage:

1. Go to https://omni.apex.exchange
2. Open Chrome Developer Tools (F12)
3. Go to Application → Local Storage → https://omni.apex.exchange
4. Find the `apex_user` key
5. Extract your credentials from the JSON data:

```javascript
// The apex_user value contains:
{
  "state": {
    "sigs": {
      "YOUR_ETH_ADDRESS": {
        "apiKey": {
          "key": "YOUR_API_KEY",
          "secret": "YOUR_API_SECRET",
          "passphrase": "YOUR_PASSPHRASE"
        },
        "id": "YOUR_ACCOUNT_ID",
        "l2Key": "YOUR_L2_KEY",
        "zkAccountId": "YOUR_ZK_ACCOUNT_ID"
      }
    }
  }
}
```

Extract these values and add them to your `.env` file:
- `apiKey.key` → `APEX_API_KEY`
- `apiKey.secret` → `APEX_API_SECRET`
- `apiKey.passphrase` → `APEX_API_PASSPHRASE`
- `id` → `APEX_ACCOUNT_ID`

## Usage

### Register a New Account
```bash
npm run register
```
This will generate API credentials from your Ethereum private key.

### Check Account Information
```bash
npm run account-info
```
Shows your user info, balance, positions, and open orders.

### Monitor Market Prices
```bash
npm run monitor-prices
```
Shows available trading pairs, current prices, and order book data.

## API Client Usage

### ApexEasy (Simplified API)

The easiest way to use this package:

```javascript
const { ApexEasy } = require('apex-omni-api');

// Public endpoints
const apex = ApexEasy.public();
const prices = await apex.getAllPrices();
const orderBook = await apex.getOrderBook('BTC-USDT');

// Private endpoints
const apex = ApexEasy.authenticated(apiKey, apiSecret, passphrase);
const orders = await apex.getMyOrders();
const order = await apex.placeLimitOrder('BTC-USDT', 'buy', 0.001, 50000);
```

See [ApexEasy Guide](./EASY.md) for full documentation.

### Direct Client (Full Control)

```javascript
const ApexOmniClient = require('apex-omni-api');
const client = new ApexOmniClient(apiKey, apiSecret, passphrase);

// Get user info
const user = await client.getUser();

// Get account balance
const balance = await client.getAccountBalance();

// Get open positions
const account = await client.getAccount();

// Get open orders
const orders = await client.getOpenOrders();

// Get trade history
const fills = await client.getFills();
```

## Available Methods

### Authenticated Endpoints
- `getUser()` - Get user information
- `getAccount()` - Get account details including positions
- `getAccountBalance()` - Get account balance and PnL
- `getOpenOrders()` - Get all open orders
- `getHistoryOrders(params)` - Get order history
- `getFills(params)` - Get trade history
- `createOrder(params)` - Create a new order
- `cancelOrder(orderId)` - Cancel an order
- `cancelAllOrders(symbol)` - Cancel all orders

### Public Endpoints
- `getTime()` - Get server time
- `getSymbols()` - Get all trading pairs
- `getTicker(symbol)` - Get ticker data
- `getOrderBook(symbol, limit)` - Get order book

## External Resources

- [Apex Pro API Documentation](https://api-docs.pro.apex.exchange/)
- [Apex Omni Exchange](https://omni.apex.exchange)
- [GitHub Repository](https://github.com/RocketFlowNL/apex-omni-api-nodejs)
- [NPM Package](https://www.npmjs.com/package/apex-omni-api)

## Security Notes

- Never commit your `.env` file
- Keep your API credentials secure
- The `.gitignore` file excludes sensitive files

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Credits

This package was created and is maintained by **Job Wiegant** of [RocketFlow](https://rocketflow.nl).

## Support the Project

If you find this package helpful in your projects, consider supporting its development:

☕ [Buy Me a Coffee](https://coff.ee/jobwiegant)

Your support helps maintain and improve this package!

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes in each version.