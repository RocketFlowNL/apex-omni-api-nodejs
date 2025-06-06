# Apex Omni API Client (Node.js)

A Node.js client for interacting with the Apex Omni exchange API.

## Author

Created by Job Wiegant of RocketFlow  
Email: job@rocketflow.nl

## Support

If you find this project helpful, consider buying me a coffee!  
☕ [Buy Me a Coffee](https://coff.ee/jobwiegant)

## Setup

1. Install dependencies:
   ```bash
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

## API Client

The main client is in `apex-client.js`. Example usage:

```javascript
const ApexOmniClient = require('./apex-client');
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

## Documentation

- [Apex Pro API Documentation](https://api-docs.pro.apex.exchange/)
- [Apex Omni Exchange](https://omni.apex.exchange)

## Security Notes

- Never commit your `.env` file
- Keep your API credentials secure
- The `.gitignore` file excludes sensitive files

## License

MIT License - see [LICENSE](./LICENSE) file for details.