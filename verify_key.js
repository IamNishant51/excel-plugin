const https = require('https');

const apiKey = "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";

const options = {
  hostname: 'api.groq.com',
  path: '/openai/v1/models',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      if (data.data) {
        console.log("Available Models:");
        data.data.forEach(m => console.log(`- ${m.id}`));
      } else {
        console.log("Response:", body);
      }
    } catch (e) {
      console.log("Response:", body);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
