import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages & Components
import Home from './pages/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      {/* Router to handle routing */}
      <Router>
        {/* Navigation bar */}
        <Navbar />
        <div className="pages">
          {/* Define app routes */}
          <Routes>
            <Route 
              path="/" 
              element={<Home />} 
            />
            {/* Add more routes here if needed */}
            {/* Example: */}
            {/* <Route path="/about" element={<About />} /> */}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
