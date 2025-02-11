import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('authenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('authenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('authenticated', 'true');
  };
  return (
      <div className='app'>
        <Router>
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}>
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
        </Router>
      </div>
  )
}

export default App
