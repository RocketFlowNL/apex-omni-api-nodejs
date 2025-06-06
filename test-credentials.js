require('dotenv').config();
const { ApexEasy } = require('./index');

async function testCredentials() {
    console.log('Testing Apex Omni API Credentials...\n');
    
    // Check environment variables
    const required = ['APEX_API_KEY', 'APEX_API_SECRET', 'APEX_API_PASSPHRASE'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        console.log('\nMake sure your .env file contains:');
        console.log('APEX_API_KEY=your_key');
        console.log('APEX_API_SECRET=your_secret');
        console.log('APEX_API_PASSPHRASE=your_passphrase');
        return;
    }
    
    console.log('✅ All required environment variables found\n');
    
    // Test public endpoints first
    console.log('Testing public endpoints...');
    try {
        const publicClient = ApexEasy.public();
        const btcData = await publicClient.getPrice('BTC-USDT');
        console.log('✅ Public API working - BTC Price: $' + (btcData.price || 'N/A'));
    } catch (error) {
        console.error('❌ Public API error:', error.message);
    }
    
    // Test private endpoints
    console.log('\nTesting private endpoints...');
    try {
        const client = ApexEasy.authenticated(
            process.env.APEX_API_KEY,
            process.env.APEX_API_SECRET,
            process.env.APEX_API_PASSPHRASE
        );
        
        const user = await client.getAccountSummary();
        console.log('✅ Authentication successful!');
        console.log('User ID:', user.userId || 'N/A');
        console.log('Email:', user.email || 'N/A');
        console.log('Balance: $' + (user.balance.available ? user.balance.available.toFixed(2) : 'N/A'));
        
    } catch (error) {
        console.error('❌ Authentication failed:', error.message);
        if (error.message.includes('401')) {
            console.log('\nPossible issues:');
            console.log('1. Invalid API credentials');
            console.log('2. API key not activated');
            console.log('3. Wrong passphrase');
        }
    }
}

testCredentials();