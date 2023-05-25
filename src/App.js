import './App.css';
import Mandelbrot from './Mandelbrot';

function App() {
  return (
    <div className="App">
      <Mandelbrot width={window.innerWidth} height={window.innerHeight} maxIterations={200} initialZoom={1/4} initialCenterX={-1} initialCenterY={0} />
      {/* <Mandelbrot width={400} height={400} maxIterations={200} initialZoom={1/4} initialCenterX={-1.25} initialCenterY={0} /> */}
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