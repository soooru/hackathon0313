import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Product } from '../types';
import styles, { submitBtnStyle } from './ProductFormPage.styles';

const TAGS = ['팝니다', '삽니다', '나눕니다', '같이삽시다'];

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('팝니다');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body: Record<string, unknown> = { title, description, tag };
      if (price) { body.price = parseInt(price); body.is_negotiable = isNegotiable; }
      if (tag === '같이삽시다' && maxParticipants) body.max_participants = parseInt(maxParticipants);
      const product = await api.post<Product>('/api/products', body);
      navigate(`/products/${product.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>📦 상품 등록</h2>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>제목</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="상품 제목을 입력하세요"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>설명</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="상품에 대해 자세히 설명해주세요"
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
                  <input
                    type="radio"
                    name="tag"
                    value={t}
                    checked={tag === t}
                    onChange={() => setTag(t)}
                    style={styles.radioInput}
                  />
                  {t}
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
              <p style={styles.hint}>인원이 다 차면 출항 버튼이 활성화됩니다.</p>
            </div>
          )}

          {error && <p style={styles.errorText}>{error}</p>}

          <div style={styles.actionRow}>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>취소</button>
            <button type="submit" disabled={loading} style={submitBtnStyle(loading)}>
              {loading ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
