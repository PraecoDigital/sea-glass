const http = require('http');

console.log('🧪 Testing BadBudget Application...\n');

// Test 1: Check if server is running
console.log('1️⃣ Testing server availability...');
const testServer = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000', (res) => {
      console.log(`   ✅ Server responding with status: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ Server error: ${err.message}`);
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      console.log('   ⏰ Server timeout');
      reject(new Error('Timeout'));
    });
  });
};

// Test 2: Check if HTML is loading
console.log('2️⃣ Testing HTML content...');
const testHTML = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (data.includes('BadBudget') && data.includes('root')) {
          console.log('   ✅ HTML content looks correct');
          resolve(true);
        } else {
          console.log('   ❌ HTML content missing expected elements');
          reject(new Error('Invalid HTML'));
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ HTML test error: ${err.message}`);
      reject(err);
    });
  });
};

// Test 3: Check if JavaScript bundle is loading
console.log('3️⃣ Testing JavaScript bundle...');
const testJS = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/static/js/bundle.js', (res) => {
      if (res.statusCode === 200) {
        console.log('   ✅ JavaScript bundle is accessible');
        resolve(true);
      } else {
        console.log(`   ❌ JavaScript bundle error: ${res.statusCode}`);
        reject(new Error(`JS bundle status: ${res.statusCode}`));
      }
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ JavaScript test error: ${err.message}`);
      reject(err);
    });
  });
};

// Run all tests
async function runTests() {
  try {
    await testServer();
    await testHTML();
    await testJS();
    
    console.log('\n🎉 All tests passed! BadBudget is running successfully.');
    console.log('🌐 Open http://localhost:3000 in your browser to use the application.');
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    console.log('🔧 Check if the development server is running with: npm start');
  }
}

runTests();
