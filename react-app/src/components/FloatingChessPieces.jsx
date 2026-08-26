import React, { useEffect, useRef, useMemo } from 'react';
import Matter from 'matter-js';
import wK from '../assets/wk.png';
import wQ from '../assets/wq.png';
import wR from '../assets/wr.png';
import wB from '../assets/wb.png';
import wN from '../assets/wn.png';
import wP from '../assets/wp.png';

const FloatingChessPieces = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const elementsRef = useRef([]);

  // Setup the pieces config
  const pieceConfig = useMemo(() => {
    // Relative scaling according to actual chess set and user request
    const types = [
      { src: wK, scale: 1.0 },
      { src: wQ, scale: 0.9 },
      { src: wB, scale: 0.75 },
      { src: wN, scale: 0.75 },
      { src: wR, scale: 0.75 },
      { src: wP, scale: 0.6 }
    ];

    const pieces = [];
    // Spawn roughly 20-25 pieces
    for (let i = 0; i < 22; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      pieces.push({
        id: i,
        src: type.src,
        // Overall size multiplier for the screen
        size: type.scale * 100, // max 100px for king
        opacity: Math.random() * 0.10 + 0.15 // 0.15 to 0.25 prominent opacity
      });
    }
    return pieces;
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Setup Engine
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 0; // zero gravity
    engine.world.gravity.x = 0;
    engineRef.current = engine;

    const { Engine, World, Bodies, Body } = Matter;
    
    // We get window dimensions for walls
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 2. Padding for wrap-around
    const pad = 150;

    // 3. Create piece bodies using a grid to ensure uniform distribution and prevent initial overlap
    const cols = Math.ceil(Math.sqrt(pieceConfig.length * (width / height)));
    const rows = Math.ceil(pieceConfig.length / cols);
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    const cells = Array.from({length: cols * rows}, (_, i) => i).sort(() => Math.random() - 0.5);

    const bodies = pieceConfig.map((piece, index) => {
      const cellIndex = cells[index % cells.length];
      const col = cellIndex % cols;
      const row = Math.floor(cellIndex / cols);
      
      // Center in cell with minor jitter so it's not perfectly rigid
      const x = (col * cellWidth) + (cellWidth / 2) + (Math.random() * 20 - 10);
      const y = (row * cellHeight) + (cellHeight / 2) + (Math.random() * 20 - 10);
      
      const body = Bodies.circle(x, y, piece.size / 2.2, { // slightly smaller hitbox than image bounds
        restitution: 1, // bouncy
        friction: 0,
        frictionAir: 0, // no air resistance
      });

      // Apply initial velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.4 + 0.2;
      Body.setVelocity(body, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.015);
      
      return body;
    });

    World.add(engine.world, bodies);

    // 4. Create custom render loop to sync DOM elements
    let animationFrameId;
    const renderLoop = () => {
      Engine.update(engine, 1000 / 60);

      // Enforce constant velocity and wrap around screen edges
      bodies.forEach((body) => {
         const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
         const minSpeed = 0.2;
         const maxSpeed = 0.8;
         if (speed < minSpeed) {
            Body.setVelocity(body, { 
              x: (body.velocity.x / speed) * minSpeed || minSpeed, 
              y: (body.velocity.y / speed) * minSpeed || minSpeed 
            });
         } else if (speed > maxSpeed) {
            Body.setVelocity(body, { 
              x: (body.velocity.x / speed) * maxSpeed, 
              y: (body.velocity.y / speed) * maxSpeed 
            });
         }

         // Wrapping logic
         if (body.position.x > width + pad) {
           Body.setPosition(body, { x: -pad, y: body.position.y });
         } else if (body.position.x < -pad) {
           Body.setPosition(body, { x: width + pad, y: body.position.y });
         }
         
         if (body.position.y > height + pad) {
           Body.setPosition(body, { x: body.position.x, y: -pad });
         } else if (body.position.y < -pad) {
           Body.setPosition(body, { x: body.position.x, y: height + pad });
         }
      });

      // Update DOM elements
      bodies.forEach((body, index) => {
        const el = elementsRef.current[index];
        if (el) {
          el.style.transform = `translate(${body.position.x - pieceConfig[index].size / 2}px, ${body.position.y - pieceConfig[index].size / 2}px) rotate(${body.angle}rad)`;
        }
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // 5. Handle resize
    const handleResize = () => {
       width = window.innerWidth;
       height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [pieceConfig]);

  return (
    <div ref={sceneRef} className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {pieceConfig.map((piece, index) => (
        <img
          key={piece.id}
          ref={(el) => (elementsRef.current[index] = el)}
          src={piece.src}
          alt="Chess Piece"
          className="absolute will-change-transform"
          style={{
            width: piece.size,
            height: piece.size,
            opacity: piece.opacity,
            top: 0,
            left: 0,
            // Convert any SVG colors to flat white silhouette
            filter: 'brightness(0) invert(1) drop-shadow(0 0 2px rgba(255,255,255,0.2))'
          }}
        />
      ))}
    </div>
  );
};

export default FloatingChessPieces;
