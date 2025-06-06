const ApexOmniClient = require('./apex-client');
const ApexEasy = require('./lib/apex-easy');
const testSetup = require('./lib/test-setup');

module.exports = ApexOmniClient;
module.exports.ApexOmniClient = ApexOmniClient;
module.exports.ApexEasy = ApexEasy;
module.exports.testSetup = testSetup;
module.exports.default = ApexOmniClient;