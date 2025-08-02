#!/usr/bin/env node

/**
 * Simple webhook tester script
 * Run this script to test the webhook endpoints
 */

const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:3000';

// Load sample webhook data
const sampleData = JSON.parse(fs.readFileSync(path.join(__dirname, '../examples/sample-webhooks.json'), 'utf-8'));

async function testWebhook(eventName, eventData) {
  try {
    console.log(`\n🧪 Testing ${eventName}...`);

    const response = await fetch(`${baseUrl}/api/funnelfox/v1/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FunnelFox-Test/1.0'
      },
      body: JSON.stringify(eventData)
    });

    const result = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📄 Response:`, JSON.stringify(result, null, 2));
    
    return response.ok;
  } catch (error) {
    console.error(`❌ Error testing ${eventName}:`, error.message);
    return false;
  }
}


async function runTests() {
  console.log('🚀 Starting webhook tests...');
  console.log(`📡 Base URL: ${baseUrl}`);
  
  // Test each webhook type
  const tests = [
    ['Quiz Completed', sampleData.quiz_completed_example],
    ['Payment Succeeded', sampleData.payment_succeeded_example],
    ['Lead Created', sampleData.lead_created_example]
  ];
  
  let allPassed = true;
  
  for (const [name, data] of tests) {
    const passed = await testWebhook(name, data);
    if (!passed) allPassed = false;
  }
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed.');
    process.exit(1);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with built-in fetch support.');
  console.error('   Alternatively, you can install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests().catch(console.error);
