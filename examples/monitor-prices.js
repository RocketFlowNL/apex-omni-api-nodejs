const ApexOmniClient = require('../apex-client');

async function monitorPrices() {
    const client = new ApexOmniClient(); // No auth needed for public endpoints

    try {
        // Get available symbols
        console.log('📊 Available Trading Pairs:');
        const symbols = await client.getSymbols();
        const btcPairs = symbols.data.filter(s => s.symbol.includes('BTC'));
        console.log(`  Found ${btcPairs.length} BTC pairs`);

        // Monitor BTC-USDT
        console.log('\n💹 BTC-USDT Ticker:');
        const ticker = await client.getTicker('BTC-USDT');
        if (ticker.data) {
            console.log(`  Last Price: $${ticker.data.lastPrice}`);
            console.log(`  24h Change: ${ticker.data.priceChangePercent}%`);
            console.log(`  24h Volume: ${ticker.data.volume}`);
        }

        // Get order book
        console.log('\n📖 BTC-USDT Order Book (Top 5):');
        const orderBook = await client.getOrderBook('BTC-USDT', 5);
        if (orderBook.data) {
            console.log('  Bids:');
            orderBook.data.bids.slice(0, 5).forEach(([price, size]) => {
                console.log(`    $${price} - ${size} BTC`);
            });
            console.log('  Asks:');
            orderBook.data.asks.slice(0, 5).forEach(([price, size]) => {
                console.log(`    $${price} - ${size} BTC`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

monitorPrices();