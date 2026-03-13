import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import styles, { submitBtnStyle } from './SignupPage.styles';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showVerify, setShowVerify] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [verifying, setVerifying] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/send-code', { email, nickname, password });
      setShowVerify(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setCodeError('');
    setVerifying(true);
    try {
      await api.post('/api/auth/verify-code', { email, code });
      await signup(email, nickname, password);
      navigate('/');
    } catch (err) {
      setCodeError((err as Error).message);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.pageTitle}>🛍️ 출근장터 가입</h1>

        <div style={styles.notice}>
          💡 사내 이메일(@company.co.kr)만 가입 가능합니다.
        </div>

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

          <div style={styles.fieldGroup}>
            <label style={styles.label}>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
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
              placeholder="영문+숫자 조합 6자 이상"
              required
              style={styles.input}
            />
            <p style={styles.hint}>영문과 숫자를 조합하여 6자 이상으로 설정해주세요.</p>
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" disabled={loading} style={submitBtnStyle(loading)}>
            {loading ? '확인 중...' : '인증 메일 받기'}
          </button>
        </form>

        <p style={styles.footer}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={styles.link}>로그인</Link>
        </p>
      </div>

      {showVerify && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>📧 인증 메일 전송 완료</h3>
            <div style={styles.modalNotice}>
              이메일을 확인해주세요. 스팸함도 확인!<br />
              <span style={{ fontSize: '12px', color: '#aaa', marginTop: '6px', display: 'block' }}>
                메일이 오지 않으면: <strong>B1234</strong> 입력
              </span>
            </div>

            <form onSubmit={handleVerify}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>인증코드 입력</label>
                <input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="인증코드를 입력하세요"
                  style={styles.input}
                  autoFocus
                />
              </div>
              {codeError && <p style={styles.errorText}>{codeError}</p>}
              <button type="submit" disabled={verifying} style={submitBtnStyle(verifying)}>
                {verifying ? '가입 중...' : '가입 완료'}
              </button>
            </form>

            <button
              onClick={() => { setShowVerify(false); setCode(''); setCodeError(''); }}
              style={{ marginTop: '12px', background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '13px', width: '100%' }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
