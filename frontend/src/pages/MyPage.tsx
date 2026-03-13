import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import styles from './MyPage.styles';

export default function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    api.get<Product[]>('/api/users/me/products')
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleWithdraw() {
    try {
      await api.delete('/api/users/me');
      logout();
      navigate('/login');
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.profileCard}>
        <div style={styles.avatar}>👤</div>
        <div>
          <h2 style={styles.profileNickname}>{user?.nickname}</h2>
          <p style={styles.profileEmail}>{user?.email}</p>
          <p style={styles.profileDate}>가입일: {user?.created_at?.slice(0, 10)}</p>
        </div>
      </div>

      <h3 style={styles.sectionTitle}>내 상품 목록 ({products.length}개)</h3>

      {loading ? (
        <div style={styles.loadingBox}>로딩 중...</div>
      ) : products.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>📭</div>
          <p>아직 등록한 상품이 없어요!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      <div style={styles.withdrawSection}>
        <button onClick={() => setShowDialog(true)} style={styles.withdrawBtn}>
          회원탈퇴
        </button>
      </div>

      {showDialog && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <p style={styles.dialogTitle}>😢 진짜로 날 떠날거야?</p>
            <p style={styles.dialogDesc}>탈퇴하면 계정 정보가 삭제되지만, 작성한 게시글과 댓글은 남아 있어요.</p>
            <div style={styles.dialogActions}>
              <button onClick={() => setShowDialog(false)} style={styles.dialogStayBtn}>남기</button>
              <button onClick={handleWithdraw} style={styles.dialogLeaveBtn}>떠나기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
