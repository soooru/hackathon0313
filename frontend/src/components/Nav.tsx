import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import styles, { tabStyle } from './Nav.styles';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.get<{ count: number }>('/api/messages/unread-count')
      .then(r => setUnreadCount(r.count))
      .catch(() => {});
  }, [location.pathname]);
  const userRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (isMobile) {
    return (
      <nav style={styles.nav}>
        <div style={styles.mobileInner}>
          {/* 좌: 햄버거 */}
          <div ref={menuRef} style={styles.mobileLeft}>
            <button onClick={() => setMenuOpen(v => !v)} style={styles.iconBtn}>☰</button>
            {menuOpen && (
              <div style={styles.mobileDropdown}>
                <NavLink to="/" end style={({ isActive }) => tabStyle(isActive)} onClick={() => setMenuOpen(false)}>홈</NavLink>
                <NavLink to="/products/new" style={({ isActive }) => tabStyle(isActive)} onClick={() => setMenuOpen(false)}>상품등록</NavLink>
                <NavLink to="/messages" style={({ isActive }) => tabStyle(isActive)} onClick={() => setMenuOpen(false)}>
                  쪽지{unreadCount > 0 && <span style={styles.unreadBadge}>{unreadCount}</span>}
                </NavLink>
              </div>
            )}
          </div>

          {/* 중앙: 로고 */}
          <span style={styles.mobileLogo} onClick={() => navigate('/')}>🛍️ 출근장터</span>

          {/* 우: 사람 아이콘 */}
          {user && (
            <div ref={userRef} style={styles.mobileRight}>
              <button onClick={() => setOpen(v => !v)} style={styles.iconBtn}>👤</button>
              {open && (
                <div style={styles.dropdown}>
                  <button style={styles.dropdownItem} onClick={() => { navigate('/my'); setOpen(false); }}>마이페이지</button>
                  <button style={styles.dropdownItem} onClick={handleLogout}>로그아웃</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <span style={styles.logo}>🛍️ 출근장터</span>
        <NavLink to="/" end style={({ isActive }) => tabStyle(isActive)}>홈</NavLink>
        <NavLink to="/products/new" style={({ isActive }) => tabStyle(isActive)}>상품등록</NavLink>
        <NavLink to="/messages" style={({ isActive }) => tabStyle(isActive)}>
          쪽지{unreadCount > 0 && <span style={styles.unreadBadge}>{unreadCount}</span>}
        </NavLink>
        <div style={styles.spacer} />
        {user && (
          <div ref={userRef} style={styles.userMenuWrapper}>
            <button onClick={() => setOpen(v => !v)} style={styles.userBtn}>{user.nickname}님 ▾</button>
            {open && (
              <div style={styles.dropdown}>
                <button style={styles.dropdownItem} onClick={() => { navigate('/my'); setOpen(false); }}>마이페이지</button>
                <button style={styles.dropdownItem} onClick={handleLogout}>로그아웃</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
