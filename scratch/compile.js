const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const texPath = path.join(__dirname, '../public/CV_Mohammed_BENRABAH.tex');
const pdfPath = path.join(__dirname, '../public/CV_Mohammed_BENRABAH.pdf');

async function compile() {
  try {
    const texContent = fs.readFileSync(texPath, 'utf-8');

    // Try YtoTech LaTeX-on-HTTP API
    console.log('Sending to YtoTech LaTeX API...');
    const response = await fetch('https://latex.ytotech.com/builds/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        compiler: 'pdflatex',
        resources: [
          {
            main: true,
            content: texContent
          }
        ]
      })
    });

    console.log('Status:', response.status, response.statusText);

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text.substring(0, 500));
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/pdf')) {
      const text = await response.text();
      console.error('Not a PDF:', contentType, text.substring(0, 500));
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(pdfPath, buffer);
    console.log('PDF saved to public/CV_Mohammed_BENRABAH.pdf (' + buffer.length + ' bytes)');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

compile();
