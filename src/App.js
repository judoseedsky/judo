/* eslint-disable no-dupe-keys */
import './App.css';
// import brahma from "./img/brahma.png";
import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SoftwareEngineer from './SoftwareEngineer';
import Nomothetes from './Nomothetes';
import HymnOfThePearl from './HymnOfThePearl';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className='judo'>
        <h1>Judo گل‌ها Sky</h1>
      </div>

      <div className='details'>
        <h2 id='dev' onClick={() => navigate('/software-engineer')}>소프트웨어 엔지니어</h2>
        <br/>
        <br/>
        <h2 id='prod'>♪♬Humm♪♬</h2>
        <br/>
        <br/>
        <h2 id='greek' onClick={() => navigate('/nomothetes')}>νομοθέτης</h2>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
