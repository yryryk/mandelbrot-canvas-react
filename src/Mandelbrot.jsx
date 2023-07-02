import { useEffect, useState, useRef } from 'react';
import { useEventListener } from 'usehooks-ts';
import './Mandelbrot.css';

function Mandelbrot({
    width,
    height,
    maxIterationsCoefficient,
    setMaxIterationsCoefficient,
    canvasRef,
    ctx,
    centerX,
    centerY,
    zoom,
    isZoomIn,
    isZoomOut,
    handleZoomIn,
    handleZoomOut,
    handleZoom,
  }) {
  const [iterations, setIterations] = useState([]);
  const [maxIterations, setMaxIterations] = useState(0);
  const [red, setRed] = useState(53);
  const [green, setGreen] = useState(47);
  const [blue, setBlue] = useState(41);
  const modifierR = useRef(null);
  const modifierG = useRef(null);
  const modifierB = useRef(null);
  const IterationsCoefficient = useRef(null);

  function setRedValue(evt) {
    setRed(evt.target.value)
  };
  function setGreenValue(evt) {
    setGreen(evt.target.value)
  };
  function setBlueValue(evt) {
    setBlue(evt.target.value)
  };
  function setIterationsCoefficient(evt) {
    const newValue = evt.target.value;
    if((200 + newValue*4*Math.log2(zoom)**3) > 20) {
      if(newValue > 10) {
        setMaxIterationsCoefficient(10)
      } else if(newValue < 0.05) {
        setMaxIterationsCoefficient(0.05)
      } else{
        setMaxIterationsCoefficient(newValue)
      }
    }
  };

  useEventListener('change', setRedValue, modifierR);
  useEventListener('change', setGreenValue, modifierG);
  useEventListener('change', setBlueValue, modifierB);
  useEventListener('change', setIterationsCoefficient, IterationsCoefficient);

  useEffect(() => {
    const data = () => {
      const maxIterationsСalculated = Math.floor(200 + maxIterationsCoefficient*4*Math.log2(zoom)**3);
      console.log(`maxIterations: ${maxIterationsСalculated}`);
      console.log("");
      const arr = [];
      for (let y = 0; y < height; y++) {
        const subArr = [];
        for (let x = 0; x < width; x++) {
          const cx = centerX + (x - width / 2) / (width * zoom);
          const cy = centerY + (y - height / 2)  / (width * zoom);

          let zx = 0;
          let zy = 0;
          let zx2 = 0;
          let zy2 = 0;
          let i = 0;

          while (zx2 + zy2 < 4 && i < maxIterationsСalculated) {
            zy = 2 * zx * zy + cy;
            zx = zx2 - zy2 + cx;
            zx2 = zx * zx;
            zy2 = zy * zy;
            i++;
          }
          subArr.push(i);
        }
        arr.push(subArr)
      }
      return {arr, maxIterationsСalculated}
    }

    async function calculate() {
      const iterationsСalculated = await data();
      if(iterationsСalculated) {
        setIterations(iterationsСalculated.arr)
        setMaxIterations(iterationsСalculated.maxIterationsСalculated);
      }
    };

    if (ctx) {
      calculate()
    }
  }, [width, height, maxIterationsCoefficient, ctx, centerX, centerY, zoom]);

  useEffect(() => {
    function renderCanvas(ctx, maxIterations, rgbModifiers) {
      let imageData = ctx.getImageData(0, 0, width, height);
      let data = imageData.data;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = iterations[y][x];
          const index = (y * width + x) * 4;
          if (i === maxIterations) {
            data[index] = 0;
            data[index+1] = 0;
            data[index+2] = 0;
            data[index+3] = 255;
          } else {
            const r = (127 + 64 * Math.sin((1/rgbModifiers.r) * i));
            const g = (127 + 64 * Math.sin((1/rgbModifiers.g) * i));
            const b = (127 + 64 * Math.sin((1/rgbModifiers.b) * i));
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
    if (ctx&&maxIterations) {
      renderCanvas(ctx, maxIterations, {r: red, g: green,b: blue})
    }
  }, [blue, green, red, ctx, iterations, maxIterations]); // No resize bug without width and height in dependenses

  return (
    <div className="mandelbrot">
      <div className={`mandelbrot__button-container ${isZoomIn ? " mandelbrot__button-container_zoom-in" : ""} ${ isZoomOut ? " mandelbrot__button-container_zoom-out" : ""}`}>
        <button onClick={handleZoomIn} className={`mandelbrot__button mandelbrot__button_in${isZoomIn?" mandelbrot__button_active":""}`}></button>
        <button onClick={handleZoomOut} className={`mandelbrot__button mandelbrot__button_out${isZoomOut?" mandelbrot__button_active":""}`}></button>
      </div>
      <canvas className='mandelbrot__canvas' ref={canvasRef} width={width} height={height} onClick={handleZoom} />
      <div className="mandelbrot__modifiers">
        <div>
          <label htmlFor='r'>R-spread</label>
          <input ref={modifierR} name='r' className="mandelbrot__modifiers-item" type='number' defaultValue={red} />
        </div>
        <div>
          <label htmlFor='r'>G-spread</label>
          <input ref={modifierG} name='g' className="mandelbrot__modifiers-item" type='number' defaultValue={green} />
        </div>
        <div>
          <label htmlFor='r'>B-spread</label>
          <input ref={modifierB} name='b' className="mandelbrot__modifiers-item" type='number' defaultValue={blue} />
        </div>
        <div>
          <label htmlFor='maxIterations'>MaxIterationsCoefficient</label>
          <input ref={IterationsCoefficient} name='maxIterations' className="mandelbrot__modifiers-item" type='number' defaultValue={maxIterationsCoefficient} min={0.05} max={10} step={0.05} />
        </div>
        <p className="mandelbrot__zoom">Zoom: {zoom}</p>
      </div>
    </div>
  );
}


export default Mandelbrot;
