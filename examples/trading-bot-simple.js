/**
 * Simple trading bot example using ApexEasy
 * 
 * WARNING: This is for educational purposes only!
 * Do not use with real funds without proper testing and risk management.
 */

require('dotenv').config();
const ApexEasy = require('../lib/apex-easy');

class SimpleGridBot {
    constructor(symbol, gridLevels, gridSpacing, orderSize) {
        this.symbol = symbol;
        this.gridLevels = gridLevels;
        this.gridSpacing = gridSpacing; // Percentage spacing between orders
        this.orderSize = orderSize;
        this.orders = new Map();
        this.isRunning = false;
        
        // Initialize authenticated client
        this.apex = ApexEasy.authenticated(
            process.env.APEX_API_KEY,
            process.env.APEX_API_SECRET,
            process.env.APEX_API_PASSPHRASE
        );
    }
    
    async start() {
        console.log(`Starting Grid Bot for ${this.symbol}...`);
        this.isRunning = true;
        
        try {
            // Get current price
            const currentPrice = await this.apex.getPrice(this.symbol);
            console.log(`Current ${this.symbol} price: $${ApexEasy.formatNumber(currentPrice.price)}`);
            
            // Cancel any existing orders
            console.log('Cancelling existing orders...');
            await this.apex.cancelAllOrders(this.symbol);
            
            // Place grid orders
            await this.placeGridOrders(currentPrice.price);
            
            // Monitor orders
            this.monitorOrders();
            
        } catch (error) {
            console.error('Error starting bot:', error.message);
            this.stop();
        }
    }
    
    async placeGridOrders(centerPrice) {
        console.log(`\nPlacing grid orders around $${ApexEasy.formatNumber(centerPrice)}...`);
        
        // Place buy orders below current price
        for (let i = 1; i <= this.gridLevels; i++) {
            const price = centerPrice * (1 - (this.gridSpacing * i / 100));
            try {
                const order = await this.apex.placeLimitOrder(
                    this.symbol,
                    'buy',
                    this.orderSize,
                    price
                );
                this.orders.set(order.orderId, { ...order, type: 'grid-buy' });
                console.log(`Placed BUY order at $${ApexEasy.formatNumber(price)}`);
            } catch (error) {
                console.error(`Failed to place buy order: ${error.message}`);
            }
        }
        
        // Place sell orders above current price
        for (let i = 1; i <= this.gridLevels; i++) {
            const price = centerPrice * (1 + (this.gridSpacing * i / 100));
            try {
                const order = await this.apex.placeLimitOrder(
                    this.symbol,
                    'sell',
                    this.orderSize,
                    price
                );
                this.orders.set(order.orderId, { ...order, type: 'grid-sell' });
                console.log(`Placed SELL order at $${ApexEasy.formatNumber(price)}`);
            } catch (error) {
                console.error(`Failed to place sell order: ${error.message}`);
            }
        }
        
        console.log(`\nGrid setup complete! Managing ${this.orders.size} orders.`);
    }
    
    async monitorOrders() {
        console.log('\nMonitoring orders... Press Ctrl+C to stop.\n');
        
        const checkInterval = setInterval(async () => {
            if (!this.isRunning) {
                clearInterval(checkInterval);
                return;
            }
            
            try {
                // Get current orders
                const openOrders = await this.apex.getMyOrders();
                const openOrderIds = new Set(openOrders.map(o => o.orderId));
                
                // Check for filled orders
                for (const [orderId, orderData] of this.orders) {
                    if (!openOrderIds.has(orderId)) {
                        console.log(`Order filled: ${orderData.side} ${orderData.size} @ $${ApexEasy.formatNumber(orderData.price)}`);
                        
                        // Replace filled order with opposite side
                        await this.replaceFilled(orderData);
                        
                        // Remove from tracking
                        this.orders.delete(orderId);
                    }
                }
                
                // Show status
                const account = await this.apex.getAccountSummary();
                console.log(`[${new Date().toLocaleTimeString()}] Balance: $${ApexEasy.formatNumber(account.balance.available)} | Open Orders: ${openOrders.length}`);
                
            } catch (error) {
                console.error('Monitor error:', error.message);
            }
        }, 10000); // Check every 10 seconds
    }
    
    async replaceFilled(filledOrder) {
        try {
            // Get current price
            const currentPrice = await this.apex.getPrice(this.symbol);
            
            // Calculate new order price
            let newPrice;
            let newSide;
            
            if (filledOrder.side === 'buy') {
                // If buy was filled, place a new sell order above
                newSide = 'sell';
                newPrice = filledOrder.price * (1 + (this.gridSpacing / 100));
            } else {
                // If sell was filled, place a new buy order below
                newSide = 'buy';
                newPrice = filledOrder.price * (1 - (this.gridSpacing / 100));
            }
            
            // Place the new order
            const newOrder = await this.apex.placeLimitOrder(
                this.symbol,
                newSide,
                this.orderSize,
                newPrice
            );
            
            this.orders.set(newOrder.orderId, { ...newOrder, type: 'grid-replace' });
            console.log(`Replaced with ${newSide} order at $${ApexEasy.formatNumber(newPrice)}`);
            
        } catch (error) {
            console.error('Failed to replace order:', error.message);
        }
    }
    
    async stop() {
        console.log('\nStopping Grid Bot...');
        this.isRunning = false;
        
        try {
            // Cancel all orders
            const result = await this.apex.cancelAllOrders(this.symbol);
            console.log(`Cancelled ${result.cancelledCount} orders.`);
            
            // Show final stats
            const account = await this.apex.getAccountSummary();
            console.log(`\nFinal Balance: $${ApexEasy.formatNumber(account.balance.total)}`);
            
        } catch (error) {
            console.error('Error stopping bot:', error.message);
        }
        
        process.exit(0);
    }
}

// Example usage
async function main() {
    // Check credentials
    if (!process.env.APEX_API_KEY || !process.env.APEX_API_SECRET || !process.env.APEX_API_PASSPHRASE) {
        console.error('Please set APEX_API_KEY, APEX_API_SECRET, and APEX_API_PASSPHRASE in your .env file');
        process.exit(1);
    }
    
    // Bot configuration
    const config = {
        symbol: 'BTC-USDT',
        gridLevels: 3,        // Number of orders on each side
        gridSpacing: 0.5,     // 0.5% spacing between orders
        orderSize: 0.0001     // Order size (0.0001 BTC)
    };
    
    console.log('=== Simple Grid Trading Bot ===');
    console.log('WARNING: This is for educational purposes only!');
    console.log(`Symbol: ${config.symbol}`);
    console.log(`Grid Levels: ${config.gridLevels} each side`);
    console.log(`Grid Spacing: ${config.gridSpacing}%`);
    console.log(`Order Size: ${config.orderSize}\n`);
    
    // Create and start bot
    const bot = new SimpleGridBot(
        config.symbol,
        config.gridLevels,
        config.gridSpacing,
        config.orderSize
    );
    
    // Handle shutdown
    process.on('SIGINT', () => bot.stop());
    process.on('SIGTERM', () => bot.stop());
    
    // Start the bot
    await bot.start();
}

// Run the bot
main().catch(console.error);