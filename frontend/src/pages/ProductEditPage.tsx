import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import styles, { submitBtnStyle } from './ProductFormPage.styles';

const TAGS = ['팝니다', '삽니다', '나눕니다', '같이삽시다'];
const STATUSES = ['가능', '완료'];

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('팝니다');
  const [status, setStatus] = useState('가능');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get<Product>(`/api/products/${id}`)
      .then(p => {
        if (user && p.user_id !== user.id) { navigate(`/products/${id}`); return; }
        setTitle(p.title);
        setDescription(p.description);
        setTag(p.tag);
        setStatus(p.status);
        setPrice(p.price !== null ? String(p.price) : '');
        setIsNegotiable(p.is_negotiable === 1);
        setMaxParticipants(p.max_participants !== null ? String(p.max_participants) : '');
      })
      .catch(() => navigate('/'))
      .finally(() => setFetching(false));
  }, [id, user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body: Record<string, unknown> = { title, description, tag, status };
      body.price = price ? parseInt(price) : null;
      body.is_negotiable = isNegotiable;
      body.max_participants = (tag === '같이삽시다' && maxParticipants) ? parseInt(maxParticipants) : null;
      await api.put<Product>(`/api/products/${id}`, body);
      navigate(`/products/${id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div style={styles.loadingBox}>로딩 중...</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>✏️ 상품 수정</h2>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>제목</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required style={styles.input} />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>설명</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={5}
              style={styles.textarea}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>카테고리</label>
            <div style={styles.radioGroup}>
              {TAGS.map(t => (
                <label key={t} style={styles.radioLabel}>
                  <input type="radio" name="tag" value={t} checked={tag === t} onChange={() => setTag(t)} style={styles.radioInput} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>판매 상태</label>
            <div style={styles.radioGroup}>
              {STATUSES.map(s => (
                <label key={s} style={styles.radioLabel}>
                  <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} style={styles.radioInput} />
                  {s}
                </label>
              ))}
            </div>
          </div>

          {tag !== '나눕니다' && <div style={styles.fieldGroup}>
            <label style={styles.label}>금액 (선택)</label>
            <div style={styles.priceRow}>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0"
                min="0"
                style={styles.priceInput}
              />
              <span style={{ fontFamily: 'inherit', fontSize: '14px' }}>원</span>
              {price && (
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={e => setIsNegotiable(e.target.checked)}
                    style={styles.checkboxInput}
                  />
                  흥정 가능
                </label>
              )}
            </div>
          </div>}

          {tag === '같이삽시다' && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>최대 인원 (선택)</label>
              <input
                type="number"
                value={maxParticipants}
                onChange={e => setMaxParticipants(e.target.value)}
                placeholder="예: 5"
                min="2"
                style={styles.input}
              />
            </div>
          )}

          {error && <p style={styles.errorText}>{error}</p>}

          <div style={styles.actionRow}>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>취소</button>
            <button type="submit" disabled={loading} style={submitBtnStyle(loading)}>
              {loading ? '수정 중...' : '수정하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
