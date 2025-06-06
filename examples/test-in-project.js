/**
 * Example of how to test apex-omni-api setup in your own project
 * This shows what users would do after installing the package
 */

// This is how you would use it after: npm install apex-omni-api
const { testSetup, ApexEasy } = require('apex-omni-api');

async function main() {
    // Option 1: Test with environment variables
    if (process.env.APEX_API_KEY) {
        console.log('Testing with environment variables...\n');
        await testSetup(
            process.env.APEX_API_KEY,
            process.env.APEX_API_SECRET,
            process.env.APEX_API_PASSPHRASE
        );
    } else {
        // Option 2: Test public API only
        console.log('Testing public API only (no credentials)...\n');
        await testSetup();
    }
    
    console.log('\n---\n');
    
    // After verification, use the API
    console.log('Now using the API...\n');
    
    try {
        const apex = ApexEasy.public();
        const ethPrice = await apex.getPrice('ETH-USDT');
        console.log(`ETH Price: $${ethPrice.price}`);
        console.log(`24h Volume: $${ethPrice.volume24h.toLocaleString()}`);
    } catch (error) {
        console.error('Error using API:', error.message);
    }
}

// Run the test
main().catch(console.error);