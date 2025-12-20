import React, { useState, useEffect } from 'react';
import './App.css';

interface PlanetData {
  name: string;
  distance: number;
  size: number;
  speed: number;
  color: string;
  ring?: boolean;
}

const planetData: PlanetData[] = [
  { name: "Mercury", distance: 110, size: 8, speed: 4.7, color: "#A5A5A5" },
  { name: "Venus", distance: 145, size: 11, speed: 3.5, color: "#E6B87C" },
  { name: "Earth", distance: 180, size: 12, speed: 2.9, color: "#4F97A3" },
  { name: "Mars", distance: 215, size: 9, speed: 2.4, color: "#D1603D" },
  { name: "Jupiter", distance: 280, size: 22, speed: 1.3, color: "#C99039" },
  { name: "Saturn", distance: 340, size: 19, speed: 0.9, color: "#E3C896", ring: true },
  { name: "Uranus", distance: 390, size: 14, speed: 0.6, color: "#A6D3D0" },
  { name: "Neptune", distance: 440, size: 15, speed: 0.5, color: "#3E54E8" }
];

function App() {
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [planetWeight, setPlanetWeight] = useState(1.0);
  const [isPaused, setIsPaused] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [isMobile, setIsMobile] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [angles, setAngles] = useState<number[]>([]);
  const [bgColor, setBgColor] = useState('#0c0c2e');
  const [planetColor, setPlanetColor] = useState('#6a00ff');
  const [orbitColor, setOrbitColor] = useState('#00eaff');
  const [sunColor, setSunColor] = useState('#ff8c00');

  // Initialize angles
  useEffect(() => {
    setAngles(planetData.map(() => Math.random() * Math.PI * 2));
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Background color effect
  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, #000022 0%, ${bgColor} 50%, #1a1a40 100%)`;
  }, [bgColor]);

  // Animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = (timestamp: number) => {
      if (!isPaused) {
        setAngles(prevAngles => 
          prevAngles.map((angle, index) => {
            const planet = planetData[index];
            return angle + (planet.speed * rotationSpeed * 0.016 * 0.5);
          })
        );
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [rotationSpeed, isPaused]);

  const handleReset = () => {
    setRotationSpeed(1.0);
    setPlanetWeight(1.0);
    setIsPaused(false);
    setZoom(1.0);
    setBgColor('#0c0c2e');
    setPlanetColor('#6a00ff');
    setOrbitColor('#00eaff');
    setSunColor('#ff8c00');
    setControlsVisible(true);
  };

  const renderPlanets = () => {
    return planetData.map((planet, index) => {
      const angle = angles[index] || 0;
      const distanceMultiplier = isMobile ? 0.8 : 1.0;
      const adjustedDistance = planet.distance * distanceMultiplier;
      
      const x = Math.cos(angle) * adjustedDistance;
      const y = Math.sin(angle) * adjustedDistance;
      
      const weightedSize = planet.size * planetWeight;
      
      return (
        <React.Fragment key={planet.name}>
          {/* Orbit */}
          <div
            className="orbit"
            style={{
              width: `${adjustedDistance * 2}px`,
              height: `${adjustedDistance * 2}px`,
              borderColor: `${orbitColor}4D`
            }}
          />
          
          {/* Planet */}
          <div
            className="planet"
            style={{
              width: `${weightedSize}px`,
              height: `${weightedSize}px`,
              background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planetColor} 80%, #000)`,
              transform: `translate(${x}px, ${y}px)`,
              boxShadow: planet.ring 
                ? `0 0 15px rgba(234, 200, 150, 0.4), inset -4px -4px 8px rgba(0, 0, 0, 0.8), inset 4px 4px 8px rgba(255, 255, 255, 0.2)`
                : `0 0 15px ${orbitColor}66, inset -4px -4px 8px rgba(0, 0, 0, 0.8), inset 4px 4px 8px rgba(255, 255, 255, 0.2)`,
              border: planet.ring ? "2px solid rgba(227, 200, 150, 0.4)" : undefined
            }}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="container">
      <div className="stars" id="stars">
        {Array.from({ length: 200 }, (_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDuration: `${Math.random() * 5 + 2}s`
            }}
          />
        ))}
      </div>
      <div className="nebula" style={{ top: '20%', left: '10%' }}></div>
      <div 
        className="nebula" 
        style={{ 
          top: '60%', 
          right: '15%', 
          background: 'radial-gradient(circle, rgba(0, 100, 150, 0.1) 0%, rgba(0, 0, 0, 0) 70%)' 
        }}
      ></div>
      
      <header>
        <div className="header-content">
          <h1>Solar System Simulation</h1>
          <p>Galaxy Sci-Fi Edition - React</p>
        </div>
        <button className="toggle-controls-btn" onClick={() => setControlsVisible(!controlsVisible)}>
          ☰ Controls
        </button>
      </header>
      
      <div className="simulation-area">
        <div 
          className="solar-system"
          style={{ '--zoom': zoom } as React.CSSProperties}
        >
          <div 
            className="sun"
            style={{
              background: `radial-gradient(circle at 30% 30%, #ffff00, ${sunColor}, #ff4500)`
            }}
          />
          {renderPlanets()}
        </div>
        
        <div className={`controls ${!controlsVisible ? 'hidden' : ''}`}>
          <div className="control-group">
            <h3>Orbital Parameters</h3>
            <label>
              Rotation Speed: <span className="value-display">{rotationSpeed.toFixed(1)}x</span>
            </label>
            <input 
              type="range" 
              min="0.1" 
              max="5" 
              step="0.1" 
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
            />
            
            <label>
              Planet Weight: <span className="value-display">{planetWeight.toFixed(1)}x</span>
            </label>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value={planetWeight}
              onChange={(e) => setPlanetWeight(parseFloat(e.target.value))}
            />
          </div>
          
          <div className="control-group">
            <h3>Galaxy Colors</h3>
            <div className="color-controls">
              <div className="color-item">
                <label>Background</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>
              <div className="color-item">
                <label>Planet Hue</label>
                <input type="color" value={planetColor} onChange={(e) => setPlanetColor(e.target.value)} />
              </div>
              <div className="color-item">
                <label>Orbit Glow</label>
                <input type="color" value={orbitColor} onChange={(e) => setOrbitColor(e.target.value)} />
              </div>
              <div className="color-item">
                <label>Sun Core</label>
                <input type="color" value={sunColor} onChange={(e) => setSunColor(e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <h3>System Controls</h3>
            <button onClick={handleReset}>Reset Simulation</button>
            <button 
              onClick={() => setIsPaused(!isPaused)}
              style={{
                background: isPaused ? 'rgba(106, 0, 255, 0.4)' : 'rgba(106, 0, 255, 0.2)',
                color: isPaused ? '#fff' : '#c59dff'
              }}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;