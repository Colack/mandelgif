const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

function generateMandelbrotSet(width, height, maxIter) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let zx = 0, zy = 0, cx = (x - width / 2) * 4 / width, cy = (y - height / 2) * 4 / height;
      let i = maxIter;
      while (zx * zx + zy * zy < 4 && i > 0) {
        let tmp = zx * zx - zy * zy + cx;
        zy = 2.0 * zx * zy + cy;
        zx = tmp;
        i--;
      }
      const pixelIndex = (x + y * width) * 4;
      const color = i === 0 ? 0 : (i / maxIter) * 255;
      imgData.data[pixelIndex] = color;
      imgData.data[pixelIndex + 1] = color;
      imgData.data[pixelIndex + 2] = color;
      imgData.data[pixelIndex + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

module.exports = (req, res) => {
  const width = 100, height = 100, frames = 10, maxIter = 100;
  const encoder = new GIFEncoder(width, height);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(500);
  encoder.setQuality(10);

  for (let i = 0; i < frames; i++) {
    const canvas = generateMandelbrotSet(width, height, maxIter - i * 10);
    encoder.addFrame(canvas.getContext('2d'));
  }

  encoder.finish();
  res.setHeader('Content-Type', 'image/gif');
  res.send(encoder.out.getData());
};