import { useState, useEffect } from 'react';

function Mandelbrot({ width, height, maxIterationsCoefficient, canvasRef, centerX, centerY, zoom, handleWheel}) {
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    setCtx(canvas.getContext('2d'));
  }, [canvasRef]);
  
  useEffect(() => {
    if (ctx) {
      const zoomExponent = Math.log2(zoom);
      const maxIterations = Math.floor(200 + maxIterationsCoefficient*4*zoomExponent**3);
      console.log(`maxIterations: ${maxIterations}`);
      console.log("");
      let imageData = ctx.getImageData(0, 0, width, height);
      let data = imageData.data;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const cx = centerX + (x - width / 2) / (width * zoom);
          const cy = centerY + (y - height / 2)  / (width * zoom);

          let zx = 0;
          let zy = 0;
          let zx2 = 0;
          let zy2 = 0;
          let i = 0;

          while (zx2 + zy2 < 4 && i < maxIterations) {
            zy = 2 * zx * zy + cy;
            zx = zx2 - zy2 + cx;
            zx2 = zx * zx;
            zy2 = zy * zy;
            i++;
          }
          const index = (y * width + x) * 4;
          if (i === maxIterations) {
            data[index] = 0;
            data[index+1] = 0;
            data[index+2] = 0;
            data[index+3] = 255;
          } else { 
            const r = 127 + 64 * Math.sin((1/50) * i);
            const g = 127 + 64 * Math.sin((1/50) * i);
            const b = 127 + 64 * Math.cos((1/40) * i);
            const saturation = (color, n) => Math.floor(((color/255)**(n/(color + 1)))*255)
            const n = 128;
            data[index] = saturation(r, n);
            data[index+1] = saturation(g, n);
            data[index+2] = saturation(b, n);
            data[index+3] = 255;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }, [width, height, maxIterationsCoefficient, ctx, centerX, centerY, zoom]);
  
  return <canvas ref={canvasRef} width={width} height={height} onWheel={handleWheel} />;
}


export default Mandelbrot;
