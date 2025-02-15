import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PropertyPage from './pages/PropertyPage'
import PropertyDetail from './pages/PropertyDetail'
import UserPage from './pages/UserPage'
import Category from './pages/Category';
import ConditionPage from './pages/ConditionPage';
import TypePage from './pages/TypePage';
import FacilityPage from './pages/FacilityPage';
import AdminPage from './pages/AdminPage';
import AdminDetail from './pages/AdminDetail';
import Homepage from './pages/Homepage';


function App() {
  const TIMEOUT_DURATION = 30 * 60 * 1000;
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('authenticated') === 'true';
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authenticated');
  };

  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (isAuthenticated) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(handleLogout, TIMEOUT_DURATION);
      }
    };
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart'
    ];

    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, handleLogout]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('authenticated', 'true');
    } else {
      localStorage.removeItem('authenticated');
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  return (
      <div className='app'>
        <PropertyPage />
        {/* <Router>
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/dashboard/homepage" /> : <Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard logout={handleLogout}/> : <Navigate to="/" />}>
            <Route path="homepage" element={<Homepage /> } />
            <Route path="properties" element={<PropertyPage /> } />
            <Route path="properties/detail" element={<PropertyDetail /> } />
            <Route path='users' element={<UserPage />} />
            <Route path='categories' element={<Category />}></Route>
            <Route path='conditions' element={<ConditionPage />}></Route>
            <Route path='types' element={<TypePage />}></Route>
            <Route path='facilities' element={<FacilityPage />}></Route>
            <Route path='admins' element={<AdminPage />}></Route>
            <Route path="admins/detail" element={<AdminDetail /> } />
            </Route>
          </Routes>
        </Router> */}
      </div>
  )
}

export default App
