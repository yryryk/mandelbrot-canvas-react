import './App.css';
import Mandelbrot from './Mandelbrot';
import { useState, useRef, useEffect } from 'react';

function App() {
  const canvasRef = useRef(null);
  // const width = 2000;
  // const height = 2000;
  const width = window.innerWidth;
  const height = window.innerHeight-29;
  const [centerX, setCenterX] = useState(-1);
  const [centerY, setCenterY] = useState(0);
  const [zoom, setZoom] = useState(1/4);
  const [maxIterationsCoefficient, setMaxIterationsCoefficient] = useState(1);
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isZoomOut, setIsZoomOut] = useState(false);

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

// newZoom: 2199023255552
// newCenterX: -1.250019962517241
// centerY: -0.0020125489954753
//maxIterations: 588133

// newZoom: 8796093022208
// newCenterX: -1.2501393169121626
// centerY: -0.005371111353860215

// newZoom: 2097152
// newCenterX: -1.3681111931091305
// newCenterY: 0.0007431717912730078
// maxIterations: 37244

// newZoom: 4194304
// newCenterX: -1.368107891139992
// newCenterY: 0.0006355606042302774
// maxIterations: 42792

// newZoom: 8388608
// newCenterX: -1.3681058664246863
// newCenterY: 0.0005586961046715917
// maxIterations: 48868

// newZoom: 67108864
// App.js:43 newCenterX: 0.359935434651561
// App.js:44 newCenterY: -0.6415037419414149
// Mandelbrot.jsx:25 maxIterations: 70504

// newZoom: 67108864
// App.js:43 newCenterX: -1.25000022060405
// App.js:44 newCenterY: 0.00037556747770590054
// Mandelbrot.jsx:25 maxIterations: 70504

// newZoom: 2147483648
// App.js:43 newCenterX: -1.7864896635665224
// App.js:44 newCenterY: 8.679844307530769e-8
// Mandelbrot.jsx:25 maxIterations: 119364

// newZoom: 134217728
// App.js:43 newCenterX: -1.2568159078628365
// App.js:44 newCenterY: 0.3797229409375518
// Mandelbrot.jsx:27 maxIterations: 78932

