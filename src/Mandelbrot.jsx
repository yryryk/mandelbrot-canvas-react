import { useEffect, useState, useRef } from 'react';
import { useEventListener } from 'usehooks-ts';
import './Mandelbrot.css';

function Mandelbrot(props) {
  const {
    width,
    height,
    maxIterationsCoefficient,
    canvasRef,
    ctx,
    centerX,
    centerY,
    zoom,
    isZoomIn,
    isZoomOut,
    handleWheel,
    handleZoomIn,
    handleZoomOut,
    handleZoom,
  } = props;
  const [iterations, setIterations] = useState([]);
  const [maxIterations, setMaxIterations] = useState(0);
  const [red, setRed] = useState(200);
  const [green, setGreen] = useState(162);
  const [blue, setBlue] = useState(131);
  const modifierR = useRef(null);
  const modifierG = useRef(null);
  const modifierB = useRef(null);

    function setRedValue(evt) {
      setRed(evt.target.value)
    };
    function setGreenValue(evt) {
      setGreen(evt.target.value)
    };
    function setBlueValue(evt) {
      setBlue(evt.target.value)
    };

  useEventListener('change', setRedValue, modifierR);
  useEventListener('change', setGreenValue, modifierG);
  useEventListener('change', setBlueValue, modifierB);

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
      const iterations = await data();
      if(iterations) {
        setIterations(iterations.arr)
        setMaxIterations(iterations.maxIterationsСalculated);
      }
    };

    if (ctx) {
      calculate()
    }
  }, [width, height, maxIterationsCoefficient, ctx, centerX, centerY, zoom, maxIterations]);

  useEffect(() => {
    function renderCanvas(ctx, maxIterations, rgbModifiers) {
      let imageData = ctx.getImageData(0, 0, width, height);
      let data = imageData.data;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = iterations[y][x];
          if (x === 1 && y === 1) {
            console.log(i);
          }
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
      renderCanvas(ctx, maxIterations, {r: red,g: green,b: blue})
    }
  }, [blue, ctx, green, height, iterations, maxIterations, red, width]);

  return (
    <div className="mandelbrot">
      <div className={`mandelbrot__button-container ${isZoomIn ? " mandelbrot__button-container_zoom-in" : ""} ${ isZoomOut ? " mandelbrot__button-container_zoom-out" : ""}`}>
        <button onClick={handleZoomIn} className={`mandelbrot__button mandelbrot__button_in${isZoomIn?" mandelbrot__button_active":""}`}></button>
        <button onClick={handleZoomOut} className={`mandelbrot__button mandelbrot__button_out${isZoomOut?" mandelbrot__button_active":""}`}></button>
      </div>
      <canvas className='mandelbrot__canvas' ref={canvasRef} width={width} height={height} onWheel={handleWheel} onClick={handleZoom} />
      <div className="mandelbrot__modifiers">
        <label htmlFor='r'>R-spread</label>
        <input ref={modifierR} name='r' className="mandelbrot__modifiers-r" type='number' defaultValue={red} />
        <label htmlFor='r'>G-spread</label>
        <input ref={modifierG} name='g' className="mandelbrot__modifiers-g" type='number' defaultValue={green} />
        <label htmlFor='r'>B-spread</label>
        <input ref={modifierB} name='b' className="mandelbrot__modifiers-b" type='number' defaultValue={blue} />
      </div>
    </div>
  );
}


export default Mandelbrot;
