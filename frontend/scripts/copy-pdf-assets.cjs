const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '..', 'node_modules', 'ngx-extended-pdf-viewer', 'assets');
const destination = path.resolve(__dirname, '..', 'src', 'assets');

function copyPdfAssets() {
  if (!fs.existsSync(source)) {
    console.warn('[copy-pdf-assets] Source assets folder not found:', source);
    return;
  }

  fs.mkdirSync(destination, { recursive: true });

  for (const entry of fs.readdirSync(source)) {
    const from = path.join(source, entry);
    const to = path.join(destination, entry);
    if (fs.existsSync(to)) {
      fs.rmSync(to, { recursive: true, force: true });
    }
    fs.cpSync(from, to, { recursive: true });
  }

  console.log('[copy-pdf-assets] Copied pdf.js assets to', destination);
}

copyPdfAssets();
