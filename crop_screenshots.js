const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'public', 'assets', 'real');

async function processImages() {
  const files = fs.readdirSync(dir).filter(f => f.startsWith('media_') && f.endsWith('.jpeg'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const metadata = await sharp(filePath).metadata();
      const { width, height } = metadata;
      
      // If it's a tall screenshot (height > width * 1.5)
      if (height > width * 1.5) {
        console.log(`Processing ${file} (width: ${width}, height: ${height})...`);
        
        // Extract a 1:1.15 rectangle from the absolute center
        const targetHeight = Math.floor(width * 1.15); // A bit taller than square just in case
        const topOffset = Math.floor((height - targetHeight) / 2);
        
        const outputBuffer = await sharp(filePath)
          .extract({
            left: 0,
            top: topOffset,
            width: width,
            height: targetHeight
          })
          .toBuffer();
          
        const tempPath = path.join(dir, 'temp_' + file);
        fs.writeFileSync(tempPath, outputBuffer);
        fs.renameSync(tempPath, filePath);
        console.log(`Cropped ${file} successfully to ${width}x${targetHeight}`);
      } else {
        console.log(`Skipping ${file} (width: ${width}, height: ${height})`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

processImages().then(() => console.log('Done!'));
