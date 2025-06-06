/**
 * Examples of using ApexEasy for public endpoints (no authentication required)
 */

const ApexEasy = require('../lib/apex-easy');

async function publicExamples() {
    // Create a public client
    const apex = ApexEasy.public();
    
    console.log('=== Apex Omni Public API Examples ===\n');
    
    try {
        // Example 1: Get single price
        console.log('1. Getting BTC-USDT price...');
        const btcPrice = await apex.getPrice('BTC-USDT');
        console.log(`BTC Price: $${ApexEasy.formatNumber(btcPrice.price)}`);
        console.log(`24h Change: ${btcPrice.change24h > 0 ? '+' : ''}${ApexEasy.formatNumber(btcPrice.change24h)}%`);
        console.log(`24h Volume: $${ApexEasy.formatNumber(btcPrice.volume24h)}\n`);
        
        // Example 2: Get order book
        console.log('2. Getting BTC-USDT order book...');
        const orderBook = await apex.getOrderBook('BTC-USDT', 5);
        console.log('Top 5 Asks (Sell Orders):');
        orderBook.asks.slice(0, 5).forEach(ask => {
            console.log(`  Price: $${ApexEasy.formatNumber(ask.price)} - Size: ${ask.size}`);
        });
        console.log('Top 5 Bids (Buy Orders):');
        orderBook.bids.slice(0, 5).forEach(bid => {
            console.log(`  Price: $${ApexEasy.formatNumber(bid.price)} - Size: ${bid.size}`);
        });
        console.log(`Spread: $${ApexEasy.formatNumber(orderBook.spread)}\n`);
        
        // Example 3: Get all prices
        console.log('3. Getting all market prices...');
        const allPrices = await apex.getAllPrices();
        const topMarkets = Object.entries(allPrices)
            .sort((a, b) => b[1].volume24h - a[1].volume24h)
            .slice(0, 5);
        
        console.log('Top 5 Markets by Volume:');
        topMarkets.forEach(([symbol, data]) => {
            console.log(`  ${symbol}: $${ApexEasy.formatNumber(data.price)} (Volume: $${ApexEasy.formatNumber(data.volume24h)})`);
        });
        console.log('');
        
        // Example 4: Watch price changes
        console.log('4. Watching ETH-USDT price (for 15 seconds)...');
        let priceUpdates = 0;
        const stopWatching = await apex.watchPrice('ETH-USDT', (error, price) => {
            if (error) {
                console.error('Price watch error:', error.message);
                return;
            }
            priceUpdates++;
            console.log(`[Update ${priceUpdates}] ETH Price: $${ApexEasy.formatNumber(price.price)} (Bid: $${ApexEasy.formatNumber(price.bid)}, Ask: $${ApexEasy.formatNumber(price.ask)})`);
        }, 3000); // Check every 3 seconds
        
        // Stop watching after 15 seconds
        setTimeout(() => {
            stopWatching();
            console.log('\nStopped watching ETH-USDT price.\n');
            
            // Example 5: Calculate position size
            console.log('5. Position size calculator...');
            apex.calculatePositionSize('BTC-USDT', 1000).then(size => {
                console.log(`With $1000, you can buy ${ApexEasy.formatNumber(size, 6)} BTC`);
            });
        }, 15000);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run examples
publicExamples();