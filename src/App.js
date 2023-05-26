import './App.css';
import Mandelbrot from './Mandelbrot';
import { useState, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);
  const [centerX, setCenterX] = useState(-1);
  const [centerY, setCenterY] = useState(0);
  const [zoom, setZoom] = useState(1/4);
  const [maxIterationsCoefficient, setMaxIterationsCoefficient] = useState(1);
  const width = window.innerWidth;
  const height = window.innerHeight;

  const handleWheel = (e) => {
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

  return (
    <div className="App">
      <Mandelbrot
        width={width}
        height={height}
        maxIterationsCoefficient={maxIterationsCoefficient}
        canvasRef={canvasRef}
        centerX={centerX}
        centerY={centerY}
        zoom={zoom}
        handleWheel={handleWheel}
      />
    </div>
  );
}

export default App;

// newZoom: 2199023255552
// newCenterX: -1.250019962517241
// centerY: -0.0020125489954753
//maxIterations: 588133
// newZoom: 8796093022208
// Mandelbrot.jsx:78 newCenterX: -1.2501393169121626
// Mandelbrot.jsx:79 centerY: -0.005371111353860215