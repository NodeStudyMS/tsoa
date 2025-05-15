import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

const Register: React.FC = () => {
  const [mid, setMid] = useState('');
  const [mpw, setMpw] = useState('');
  const [confirmMpw, setConfirmMpw] = useState('');
  const [membername, setMembername] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mpw !== confirmMpw) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }
    
    try {
      await register(mid, mpw, membername);
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>회원가입 📝</h2>
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
            <label htmlFor="membername">이름</label>
            <input
              id="membername"
              type="text"
              value={membername}
              onChange={(e) => setMembername(e.target.value)}
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
          
          <div className="form-group">
            <label htmlFor="confirmMpw">비밀번호 확인</label>
            <input
              id="confirmMpw"
              type="password"
              value={confirmMpw}
              onChange={(e) => setConfirmMpw(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        
        <p className="auth-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
