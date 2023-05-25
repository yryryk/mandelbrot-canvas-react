import { useState, useEffect, useRef } from 'react';

function Mandelbrot({ width, height, maxIterations, initialZoom, initialCenterX, initialCenterY}) {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [centerX, setCenterX] = useState(initialCenterX);
  const [centerY, setCenterY] = useState(initialCenterY);
  const [zoom, setZoom] = useState(initialZoom);
  useEffect(() => {
    const canvas = canvasRef.current;
    setCtx(canvas.getContext('2d'));
  }, []);
  
  useEffect(() => {
    if (ctx) {
      const zoomExponent = Math.log2(zoom);
      const maxIterations2 = Math.floor(maxIterations + 4*zoomExponent**3);
      // const maxIterations2 = Math.floor(maxIterations*(zoom**(1/4)));
      console.log(`maxIterations: ${maxIterations2}`);
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

          while (zx2 + zy2 < 4 && i < maxIterations2) {
            zy = 2 * zx * zy + cy;
            zx = zx2 - zy2 + cx;
            zx2 = zx * zx;
            zy2 = zy * zy;
            i++;
          }
          const index = (y * width + x) * 4;
          if (i === maxIterations2) {
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
  }, [width, height, maxIterations, ctx, centerX, centerY, zoom]);
  const handleWheel = (e) => {
    // console.log(e.deltaY);
    const delta =e.deltaY>0?-1:1;
    const newZoom = zoom*(2**delta);
    console.log(`delta: ${delta}`);
    console.log(`newZoom: ${newZoom}`);
    if (newZoom  > 0) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      const newCenterX = centerX + (x - width / 2)  / (width * (zoom )) - (x - width / 2)  / (width * newZoom);
      const newCenterY = centerY + (y - height / 2)  / (width * (zoom )) - (y - height / 2)  / (width * newZoom);
  
      console.log(`newCenterX: ${newCenterX}`);
      console.log(`newCenterY: ${newCenterY}`);
      setZoom(newZoom);
      setCenterX(newCenterX);
      setCenterY(newCenterY);
    }
  };
  
  return <canvas ref={canvasRef} width={width} height={height} onWheel={handleWheel} />;
}


export default Mandelbrot;
