/* eslint-disable no-dupe-keys */
import './App.css';
// import brahma from "./img/brahma.png";
import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SoftwareEngineer from './SoftwareEngineer';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className='judo'>
        <h1>Judo گل‌ها Sky</h1>
      </div>

      <div className='details'>
        <h2 id='dev' onClick={() => navigate('/software-engineer')}>软件工程师</h2>
        <br/>
        <br/>
        <h2 id='prod'>♪♬Humm♪♬</h2>
        <br/>
        <br/>
        <h2 id='greek'>νομοθέτης</h2>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
