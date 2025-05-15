import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/chat" />} />
          </Routes>
        </div>
    </AuthProvider>
  );
};

export default App;
