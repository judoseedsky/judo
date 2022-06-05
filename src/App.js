/* eslint-disable no-dupe-keys */
import './App.css';
// import brahma from "./img/brahma.png";
import React from "react";

function App() {

  // const style = {
  //   textDecoration: 'none',
  //   ":hover": {
  //     textDecoration: 'line-through'
  //   }
  // }

  // const devStyles = {
  //   textDecoration: 'line-through',
  //   backgroundImage: `url(${brahma})`,
  //   backgroundSize: "contain",
  //   backgroundRepeat: 'no-repeat',
  //   backgroundPosition: 'center',
  //   backgroundPosition: 'absolute',
  //   height: '100vh',
  //   width: '50vw'
  // }

  // const [devStyle, setDevStyle] = React.useState(style);

  // const handleDevClick = () => {
  //   devStyle.textDecoration === style.textDecoration ? setDevStyle(devStyles) : setDevStyle(style)

  // }


  return (
    <div className="App">
      <div className='page'>
        <h1>Judo بذرة Sky</h1>
      </div>

      <div className='details'>
        <h2 id='dev'>Software Dev</h2>
        <br/>
        <br/>
        <h2 id='prod'>♪♬Producer♪♬</h2>
        <br/>
        <br/>
        <h2 id='greek'>νομοθέτης</h2>
        <br/>
        <br/>
      </div>
      {/* <img id='buddha' src='https://thumbs.gfycat.com/ImpassionedTameBullfrog-max-1mb.gif' alt='buddha'></img> */}
    </div>
  );
}

export default App;
