/**
 * Examples of using ApexEasy for private endpoints (authentication required)
 */

require('dotenv').config();
const ApexEasy = require('../lib/apex-easy');

async function privateExamples() {
    // Create an authenticated client
    const apex = ApexEasy.authenticated(
        process.env.APEX_API_KEY,
        process.env.APEX_API_SECRET,
        process.env.APEX_API_PASSPHRASE
    );
    
    console.log('=== Apex Omni Private API Examples ===\n');
    
    try {
        // Example 1: Get account summary
        console.log('1. Getting account summary...');
        const summary = await apex.getAccountSummary();
        console.log(`User ID: ${summary.userId}`);
        console.log(`Email: ${summary.email}`);
        console.log(`Balance:`);
        console.log(`  Total: $${ApexEasy.formatNumber(summary.balance.total)}`);
        console.log(`  Available: $${ApexEasy.formatNumber(summary.balance.available)}`);
        console.log(`  In Positions: $${ApexEasy.formatNumber(summary.balance.inPositions)}`);
        console.log(`  Unrealized PnL: $${ApexEasy.formatNumber(summary.balance.unrealizedPnl)}`);
        console.log(`Open Orders: ${summary.openOrders}\n`);
        
        // Example 2: Get open orders
        console.log('2. Getting open orders...');
        const orders = await apex.getMyOrders();
        if (orders.length > 0) {
            console.log(`Found ${orders.length} open orders:`);
            orders.forEach(order => {
                console.log(`  ${order.symbol} - ${order.side} ${order.size} @ $${ApexEasy.formatNumber(order.price)}`);
                console.log(`    Status: ${order.status}, Filled: ${order.filled}/${order.size}`);
            });
        } else {
            console.log('No open orders found.');
        }
        console.log('');
        
        // Example 3: Place a limit order (small test order)
        console.log('3. Placing a test limit order...');
        try {
            // Get current BTC price first
            const btcPrice = await apex.getPrice('BTC-USDT');
            // Place a buy order 5% below current price
            const orderPrice = btcPrice.price * 0.95;
            
            const order = await apex.placeLimitOrder(
                'BTC-USDT',
                'buy',
                0.0001, // Very small size for testing
                orderPrice,
                { timeInForce: 'GTC' }
            );
            
            console.log(`Order placed successfully!`);
            console.log(`  Order ID: ${order.orderId}`);
            console.log(`  ${order.side} ${order.size} BTC @ $${ApexEasy.formatNumber(order.price)}`);
            console.log(`  Status: ${order.status}\n`);
            
            // Example 4: Cancel the order
            console.log('4. Cancelling the test order...');
            const cancelled = await apex.cancelOrder(order.orderId);
            console.log(`Order ${cancelled.orderId} cancelled successfully.\n`);
            
        } catch (error) {
            console.log(`Could not place test order: ${error.message}\n`);
        }
        
        // Example 5: Get recent trades
        console.log('5. Getting recent trades...');
        const trades = await apex.getMyTrades(null, 10);
        if (trades.length > 0) {
            console.log(`Last ${trades.length} trades:`);
            trades.forEach(trade => {
                console.log(`  ${trade.symbol} - ${trade.side} ${trade.size} @ $${ApexEasy.formatNumber(trade.price)}`);
                console.log(`    Fee: ${trade.fee} ${trade.feeAsset}, Time: ${trade.executedAt.toLocaleString()}`);
            });
        } else {
            console.log('No recent trades found.');
        }
        console.log('');
        
        // Example 6: Cancel all orders for cleanup
        console.log('6. Cleaning up - cancelling all orders...');
        const cancelResult = await apex.cancelAllOrders();
        console.log(`Cancelled ${cancelResult.cancelledCount} orders.\n`);
        
    } catch (error) {
        console.error('Error:', error.message);
        if (error.message.includes('401')) {
            console.error('Authentication failed. Please check your API credentials.');
        }
    }
}

// Check if credentials are available
if (!process.env.APEX_API_KEY || !process.env.APEX_API_SECRET || !process.env.APEX_API_PASSPHRASE) {
    console.error('Please set APEX_API_KEY, APEX_API_SECRET, and APEX_API_PASSPHRASE in your .env file');
    process.exit(1);
}

// Run examples
privateExamples();