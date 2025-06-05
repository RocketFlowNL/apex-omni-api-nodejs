const crypto = require('crypto');
const axios = require('axios');

class ApexOmniClient {
    constructor(apiKey, apiSecret, passphrase) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.passphrase = passphrase;
        this.baseURL = 'https://omni.apex.exchange';
    }

    generateSignature(timestamp, method, path, dataString = '') {
        // V3 API signature format
        const messageString = timestamp + method + path + dataString;
        
        // Base64 encode the secret first (V3 requirement)
        const base64Secret = Buffer.from(this.apiSecret).toString('base64');
        
        // Generate HMAC-SHA256 signature
        const hmac = crypto.createHmac('sha256', base64Secret);
        hmac.update(messageString);
        return hmac.digest('base64');
    }

    async makeRequest(method, path, params = {}) {
        const timestamp = Date.now().toString();
        
        // Sort parameters for signature
        const sortedItems = Object.entries(params).sort((a, b) => a[0].localeCompare(b[0]));
        const dataString = sortedItems
            .filter(([_, value]) => value !== null && value !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        
        // Build request path with query params for GET requests
        const fullPath = method === 'GET' && dataString ? `${path}?${dataString}` : path;
        
        // Generate signature (GET requests don't include params in signature)
        const signature = this.generateSignature(
            timestamp, 
            method, 
            path, 
            method === 'GET' ? '' : dataString
        );
        
        const headers = {
            'apex-signature': signature,
            'apex-timestamp': timestamp,
            'apex-api-key': this.apiKey,
            'apex-passphrase': this.passphrase,
            'Content-Type': 'application/json'
        };
        
        try {
            const response = await axios({
                method: method,
                url: `${this.baseURL}${fullPath}`,
                headers: headers,
                data: method !== 'GET' ? params : undefined
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(`API Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }

    // User endpoints
    async getUser() {
        return this.makeRequest('GET', '/api/v3/user');
    }

    // Account endpoints
    async getAccount() {
        return this.makeRequest('GET', '/api/v3/account');
    }

    async getAccountBalance() {
        return this.makeRequest('GET', '/api/v3/account-balance');
    }

    // Order endpoints
    async getOpenOrders() {
        return this.makeRequest('GET', '/api/v3/open-orders');
    }

    async getHistoryOrders(params = {}) {
        return this.makeRequest('GET', '/api/v3/history-orders', params);
    }

    async createOrder(params) {
        return this.makeRequest('POST', '/api/v3/order', params);
    }

    async cancelOrder(orderId) {
        return this.makeRequest('DELETE', '/api/v3/delete-order', { id: orderId });
    }

    async cancelAllOrders(symbol = null) {
        const params = symbol ? { symbol } : {};
        return this.makeRequest('DELETE', '/api/v3/delete-open-orders', params);
    }

    // Trade endpoints
    async getFills(params = {}) {
        return this.makeRequest('GET', '/api/v3/fills', params);
    }

    // Public endpoints (no auth required)
    async getTime() {
        const response = await axios.get(`${this.baseURL}/api/v3/time`);
        return response.data;
    }

    async getSymbols() {
        const response = await axios.get(`${this.baseURL}/api/v3/symbols`);
        return response.data;
    }

    async getTicker(symbol) {
        const response = await axios.get(`${this.baseURL}/api/v3/ticker`, {
            params: { symbol }
        });
        return response.data;
    }

    async getOrderBook(symbol, limit = 100) {
        const response = await axios.get(`${this.baseURL}/api/v3/depth`, {
            params: { symbol, limit }
        });
        return response.data;
    }
}

module.exports = ApexOmniClient;