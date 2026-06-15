import './App.css';
import { useNavigate } from 'react-router-dom';

function SoftwareEngineer() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="page-content">
        <button className="back-btn" onClick={() => navigate('/')}>
          &larr; Back
        </button>
        <h1>Software Engineer</h1>
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
