import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PropertyPage from './pages/PropertyPage'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  return (
      <div className='app'>
        <Router>
          <Routes>
            {/* <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Dashboard onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}>
            <Route path="/properties" element={<PropertyPage /> } />
            </Route> */}
            <Route path="/" element={<Dashboard />}>
            <Route path="properties" element={<PropertyPage /> } />
            </Route>
          </Routes>
        </Router>
      </div>
  )
}

export default App
