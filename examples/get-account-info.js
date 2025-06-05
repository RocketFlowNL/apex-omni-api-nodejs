const ApexOmniClient = require('../apex-client');
const dotenv = require('dotenv');

dotenv.config();

async function getAccountInfo() {
    const client = new ApexOmniClient(
        process.env.APEX_API_KEY,
        process.env.APEX_API_SECRET,
        process.env.APEX_API_PASSPHRASE
    );

    try {
        // Get user info
        console.log('📊 User Information:');
        const user = await client.getUser();
        console.log(`  Username: ${user.data.username}`);
        console.log(`  Email: ${user.data.email}`);
        console.log(`  User ID: ${user.data.id}`);

        // Get account balance
        console.log('\n💰 Account Balance:');
        const balance = await client.getAccountBalance();
        console.log(`  Total Equity: $${balance.data.totalEquityValue}`);
        console.log(`  Available: $${balance.data.availableBalance}`);
        console.log(`  Unrealized PnL: $${balance.data.unrealizedPnl}`);

        // Get positions
        console.log('\n📈 Open Positions:');
        const account = await client.getAccount();
        const positions = account.data.positions || [];
        const activePositions = positions.filter(p => p.size !== "0.000");
        
        if (activePositions.length === 0) {
            console.log('  No open positions');
        } else {
            activePositions.forEach(pos => {
                console.log(`  ${pos.symbol} ${pos.side}: ${pos.size} @ ${pos.entryPrice}`);
            });
        }

        // Get open orders
        console.log('\n📋 Open Orders:');
        const orders = await client.getOpenOrders();
        console.log(`  Count: ${orders.data?.length || 0}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

getAccountInfo();