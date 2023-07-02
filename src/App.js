import './App.css';
import Mandelbrot from './Mandelbrot';
import { useState, useRef, useEffect } from 'react';
import { useEventListener } from 'usehooks-ts';

function App() {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight-29);
  const [centerX, setCenterX] = useState(-0.75);
  const [centerY, setCenterY] = useState(0);
  const [zoom, setZoom] = useState(1/4);
  const [maxIterationsCoefficient, setMaxIterationsCoefficient] = useState(1);
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isZoomOut, setIsZoomOut] = useState(false);

  function setWindowSize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight-29);
  };

  useEventListener('resize', setWindowSize, document);

  useEffect(() => {
    setCanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    if(canvas) {
      setCtx(canvas.getContext('2d'));
    }
  }, [canvas]);

  const changeZoom = (delta, evt) => {
    const newZoom = zoom*(2**delta);
    console.log(`delta: ${delta}`);
    console.log(`newZoom: ${newZoom}`);

    if (newZoom > 0 && (200 + maxIterationsCoefficient*4*Math.log2(newZoom)**3) > 0) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;

      const newCenterX = centerX + (x - width / 2)  / (width * (zoom )) - (x - width / 2)  / (width * newZoom);
      const newCenterY = centerY + (y - height / 2)  / (width * (zoom )) - (y - height / 2)  / (width * newZoom);

      console.log(`newCenterX: ${newCenterX}`);
      console.log(`newCenterY: ${newCenterY}`);
      setZoom(newZoom);
      setCenterX(newCenterX);
      setCenterY(newCenterY);
    }
  }

  const handleZoomIn = () => {
    setIsZoomIn(!isZoomIn);
    isZoomOut&&setIsZoomOut(false);
  }

  const handleZoomOut = () => {
    setIsZoomOut(!isZoomOut);
    isZoomIn&&setIsZoomIn(false);
  }

  const handleZoom = (evt) => {
    if(isZoomIn||isZoomOut) {
      const delta = isZoomOut>0?-1:1;
      changeZoom(delta, evt);
    }
  }

  return (
    <main className="App">
      <Mandelbrot
        width={width}
        height={height}
        maxIterationsCoefficient={maxIterationsCoefficient}
        setMaxIterationsCoefficient={setMaxIterationsCoefficient}
        canvasRef={canvasRef}
        ctx={ctx}
        centerX={centerX}
        centerY={centerY}
        zoom={zoom}
        isZoomIn={isZoomIn}
        isZoomOut={isZoomOut}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleZoom={handleZoom}
      />
    </main>
  );
}

export default App;
