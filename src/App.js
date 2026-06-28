/* eslint-disable no-dupe-keys */
import './App.css';
// import brahma from "./img/brahma.png";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SoftwareEngineer from './SoftwareEngineer';
import Nomothetes from './Nomothetes';
import HymnOfThePearl from './HymnOfThePearl';
import YogaSutras from './YogaSutras';

function Home() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });

  const handleNavigation = (e, path) => {
    const rect = e.target.getBoundingClientRect();
    setClickPos({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setTransitioning(true);
    setTimeout(() => {
      navigate(path);
    }, 1300);
  };

  return (
    <div className="App">
      {transitioning && (
        <div className="page-transition">
          <div
            className="buddha-expand"
            style={{ left: clickPos.x, top: clickPos.y }}
          ></div>
        </div>
      )}
      <div className='judo'>
        <h1>Judo گل‌ها Sky</h1>
        <p className='tagline'>Programmer · νομοθέτης · Artist</p>
      </div>

      <div className='details'>
        <h2 id='dev' onClick={(e) => handleNavigation(e, '/software-engineer')}>About</h2>
        <br/>
        <br/>
        <h2 id='prod'>♪♬Humm♪♬</h2>
        <br/>
        <br/>
        <h2 id='greek' onClick={(e) => handleNavigation(e, '/nomothetes')}>Texts</h2>
        <br/>
        <br/>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/software-engineer" element={<SoftwareEngineer />} />
        <Route path="/nomothetes" element={<Nomothetes />} />
        <Route path="/hymn-of-the-pearl" element={<HymnOfThePearl />} />
        <Route path="/yoga-sutras" element={<YogaSutras />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
