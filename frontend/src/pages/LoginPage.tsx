import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles, { submitBtnStyle } from './LoginPage.styles';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.pageTitle}>🛍️ 출근장터</h1>
        <p style={styles.pageSubtitle}>출근하면 열리고 퇴근하면 닫히는 장터</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="사내 이메일을 입력하세요"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroupLast}>
            <label style={styles.label}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" disabled={loading} style={submitBtnStyle(loading)}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p style={styles.footer}>
          직원이신가요?{' '}
          <Link to="/signup" style={styles.link}>회원가입</Link>
        </p>
      </div>
    </div>
  );
}
