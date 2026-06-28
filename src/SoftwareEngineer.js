import './App.css';
import { useNavigate } from 'react-router-dom';
import owl from './img/owl.png';

function SoftwareEngineer() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="page-content">
        <button className="back-btn" onClick={() => navigate('/')}>
          &larr; Back
        </button>
        <h1>About</h1>
        <img src={owl} alt="Owl" className="owl-fixed" />
        <p className="lorem">
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
          Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum. Lorem ipsum dosum.
        </p>
      </div>
    </div>
  );
}

export default SoftwareEngineer;
