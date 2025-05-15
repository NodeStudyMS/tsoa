import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

const Login: React.FC = () => {
  const [mid, setMid] = useState('');
  const [mpw, setMpw] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(mid, mpw);
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인에 실패했습니다');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>로그인 🔐</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mid">아이디</label>
            <input
              id="mid"
              type="text"
              value={mid}
              onChange={(e) => setMid(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="mpw">비밀번호</label>
            <input
              id="mpw"
              type="password"
              value={mpw}
              onChange={(e) => setMpw(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <p className="auth-link">
          계정이 없으신가요? <Link to="/register">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
