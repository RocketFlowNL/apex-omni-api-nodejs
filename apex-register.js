const { onboardingAccount } = require('apexpro-connector-node/lib/pro/onboarding');
const { ApexClient } = require('apexpro-connector-node');
const { PROD, QA } = require('apexpro-connector-node/lib/pro/Constant');
const dotenv = require('dotenv');

dotenv.config();

async function main() {
    console.log("🚀 Apex Omni Registration (Node.js)");
    console.log("=====================================");
    
    const ethPrivateKey = process.env.ETH_PRIVATE_KEY;
    if (!ethPrivateKey) {
        console.error("❌ Error: ETH_PRIVATE_KEY not found in environment variables");
        console.error("Please create a .env file with your ETH_PRIVATE_KEY");
        return;
    }
    
    try {
        // First, let's check if the user already exists
        const apexClient = new ApexClient('PROD');
        
        console.log("\n📝 Starting registration process...");
        
        // Register new account using onboarding
        console.log("🔐 Deriving keys and registering account...");
        const result = await onboardingAccount({
            env: PROD,
            privateKey: ethPrivateKey,
            rpcUrl: process.env.RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo', // You can use a public RPC
            version: 'v2',
            token: 'USDC'
        });
        
        console.log("\n✅ Registration completed!");
        
        // Extract data from the nested structure
        const data = result.data;
        
        if (data.apiKey) {
            console.log("\n🔑 API Credentials:");
            console.log(`  Key: ${data.apiKey.key}`);
            console.log(`  Secret: ${data.apiKey.secret}`);
            console.log(`  Passphrase: ${data.apiKey.passphrase}`);
        }
        
        if (data.account) {
            console.log("\n👤 Account Information:");
            console.log(`  Account ID: ${data.account.id}`);
            console.log(`  Ethereum Address: ${data.account.ethereumAddress}`);
            console.log(`  Stark Key: ${data.account.starkKey}`);
        }
        
        if (data.user) {
            console.log("\n📊 User Details:");
            console.log(`  User ID: ${data.user.id}`);
            console.log(`  Username: ${data.user.username}`);
            console.log(`  Email: ${data.user.email}`);
            console.log(`  Affiliate Link: ${data.user.affiliateLink}`);
        }
        
        console.log("\n💾 Save these credentials for future use!");
        console.log("You can now use these to connect to your account.");
        
        // Example of how to use the credentials
        console.log("\n📖 To connect with these credentials later:");
        console.log("```javascript");
        console.log("const apiKeyCredentials = {");
        console.log(`  key: '${data.apiKey?.key}',`);
        console.log(`  secret: '${data.apiKey?.secret}',`);
        console.log(`  passphrase: '${data.apiKey?.passphrase}'`);
        console.log("};");
        console.log(`const accountId = '${data.account?.id}';`);
        console.log("await apexClient.init(apiKeyCredentials, ethPrivateKey, accountId);");
        console.log("```");
        
    } catch (error) {
        console.error("\n❌ Error occurred:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
        console.error("\nPossible issues:");
        console.error("- Invalid private key format");
        console.error("- Network connectivity issues");
        console.error("- Account may already be registered");
        console.error("- RPC endpoint issues");
    }
}

// Run the main function
main().catch(console.error);