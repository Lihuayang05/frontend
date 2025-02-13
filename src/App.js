import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// Pages & Components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      {/* Router to handle routing */}
      <Router>
        {/* Navigation bar */}
        <Navbar />
        <div className="pages">
          {/* Define app routes */}
          <Routes>
            {/* Home route - accessible only if user is logged in */}
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            {/* Login route - accessible only if user is NOT logged in */}
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            {/* Signup route - accessible only if user is NOT logged in */}
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
