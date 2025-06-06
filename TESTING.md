# Testing Guide for apex-omni-api

This guide covers how to test the apex-omni-api package during development and before deployment.

## Quick Start

```bash
# Install dependencies
npm install

# Test your credentials
npm run test:credentials

# Run examples
npm run example:public    # Test public endpoints
npm run example:private   # Test private endpoints (requires auth)
npm run example:bot       # Run simple trading bot example

# Run all tests (when available)
npm test

# Run linting (when configured)
npm run lint
```

## Test Structure

### Unit Tests

Unit tests verify individual methods and functions work correctly in isolation.

```javascript
// Example unit test
describe('ApexOmniClient', () => {
    test('should create instance with credentials', () => {
        const client = new ApexOmniClient('key', 'secret', 'passphrase');
        expect(client.apiKey).toBe('key');
        expect(client.apiSecret).toBe('secret');
        expect(client.passphrase).toBe('passphrase');
    });
    
    test('should generate correct signature', () => {
        const client = new ApexOmniClient('key', 'secret', 'passphrase');
        const signature = client.generateSignature('timestamp', 'GET', '/path');
        expect(signature).toBeDefined();
        expect(typeof signature).toBe('string');
    });
});
```

### Integration Tests

Integration tests verify the package works correctly with the actual Apex Omni API.

```javascript
// Example integration test
describe('ApexOmniClient Integration', () => {
    let client;
    
    beforeAll(() => {
        // Use test credentials from environment
        client = new ApexOmniClient(
            process.env.TEST_API_KEY,
            process.env.TEST_API_SECRET,
            process.env.TEST_PASSPHRASE
        );
    });
    
    test('should fetch server time', async () => {
        const response = await client.getTime();
        expect(response).toHaveProperty('data');
        expect(response.data).toHaveProperty('time');
    });
});
```

## Manual Testing

### 1. Test Public Endpoints

```javascript
const ApexOmniClient = require('./index');
const client = new ApexOmniClient('dummy', 'dummy', 'dummy');

// Test public endpoints (no auth required)
async function testPublicEndpoints() {
    try {
        console.log('Testing getTime()...');
        const time = await client.getTime();
        console.log('✓ Server time:', time);
        
        console.log('\nTesting getSymbols()...');
        const symbols = await client.getSymbols();
        console.log('✓ Found', symbols.data.length, 'trading pairs');
        
        console.log('\nTesting getTicker()...');
        const ticker = await client.getTicker('BTC-USDT');
        console.log('✓ BTC-USDT ticker:', ticker);
        
    } catch (error) {
        console.error('✗ Error:', error.message);
    }
}

testPublicEndpoints();
```

### 2. Test Authenticated Endpoints

Create a test script `test-auth.js`:

```javascript
require('dotenv').config();
const ApexOmniClient = require('./index');

const client = new ApexOmniClient(
    process.env.APEX_API_KEY,
    process.env.APEX_API_SECRET,
    process.env.APEX_API_PASSPHRASE
);

async function testAuthEndpoints() {
    try {
        console.log('Testing authenticated endpoints...\n');
        
        // Test user info
        console.log('Testing getUser()...');
        const user = await client.getUser();
        console.log('✓ User ID:', user.data.userId);
        
        // Test account balance
        console.log('\nTesting getAccountBalance()...');
        const balance = await client.getAccountBalance();
        console.log('✓ Account balance:', balance.data);
        
        // Test open orders
        console.log('\nTesting getOpenOrders()...');
        const orders = await client.getOpenOrders();
        console.log('✓ Open orders:', orders.data.length);
        
    } catch (error) {
        console.error('✗ Error:', error.message);
    }
}

testAuthEndpoints();
```

## Testing Checklist

Before submitting a PR or publishing, ensure:

- [ ] All unit tests pass
- [ ] Code coverage is maintained (aim for >80%)
- [ ] Linting passes with no errors
- [ ] Manual testing of public endpoints works
- [ ] Manual testing of authenticated endpoints works (if you have credentials)
- [ ] New features have corresponding tests
- [ ] Breaking changes are documented

## Setting Up Test Environment

### 1. Create Test Configuration

Create `.env.test`:
```env
# Test API credentials (use testnet if available)
TEST_API_KEY=your-test-api-key
TEST_API_SECRET=your-test-api-secret
TEST_PASSPHRASE=your-test-passphrase

# Test configuration
TEST_TIMEOUT=30000
TEST_RETRY_COUNT=3
```

### 2. Mock API Responses

For unit testing without hitting the real API:

```javascript
// __mocks__/axios.js
module.exports = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} }))
};
```

### 3. Test Different Scenarios

Test various scenarios:
- Valid responses
- Error responses (400, 401, 403, 404, 500)
- Network timeouts
- Invalid credentials
- Rate limiting
- Large response handling

## Continuous Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - run: npm run lint
```

## Performance Testing

Test performance for high-frequency operations:

```javascript
async function performanceTest() {
    const iterations = 100;
    const start = Date.now();
    
    for (let i = 0; i < iterations; i++) {
        await client.getTicker('BTC-USDT');
    }
    
    const duration = Date.now() - start;
    console.log(`${iterations} requests completed in ${duration}ms`);
    console.log(`Average: ${duration/iterations}ms per request`);
}
```

## Debugging Tips

1. **Enable debug mode** in axios:
   ```javascript
   axios.defaults.debug = true;
   ```

2. **Log all requests**:
   ```javascript
   axios.interceptors.request.use(request => {
       console.log('Request:', request);
       return request;
   });
   ```

3. **Use proxy for inspection**:
   ```javascript
   const client = new ApexOmniClient(key, secret, pass);
   client.proxy = 'http://localhost:8888'; // Use with Charles/Fiddler
   ```

## Reporting Test Results

When reporting issues, include:
- Node.js version
- Package version
- Test that failed
- Error message and stack trace
- Steps to reproduce
- Expected vs actual behavior