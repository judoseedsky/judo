import './App.css';
import { useNavigate } from 'react-router-dom';

function Nomothetes() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="page-content">
        <button className="back-btn" onClick={() => navigate('/')}>
          &larr; Back
        </button>
        <h1>Texts</h1>
        <ul className="book-list">
          <li onClick={() => navigate('/hymn-of-the-pearl')}>Hymn of The Pearl</li>
          <li onClick={() => navigate('/yoga-sutras')}>Yoga Sutras</li>
        </ul>
      </div>
    </div>
  );
}

export default Nomothetes;
