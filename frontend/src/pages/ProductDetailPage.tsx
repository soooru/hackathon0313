import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Product, Comment, GroupBuyParticipant } from '../types';
import { useAuth } from '../context/AuthContext';
import styles, { tagBadgeStyle, commentSubmitBtnStyle, statusToggleBtnStyle } from './ProductDetailPage.styles';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');

  const [joined, setJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [joinLoading, setJoinLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [participants, setParticipants] = useState<GroupBuyParticipant[]>([]);

  const [showDots, setShowDots] = useState(false);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.get<Product>(`/api/products/${id}`),
      api.get<Comment[]>(`/api/products/${id}/comments`),
    ]).then(([p, c]) => {
      setProduct(p);
      setParticipantCount(p.participant_count ?? 0);
      setComments(c);
    }).catch(() => navigate('/')).finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (!product || product.tag !== '같이삽시다') return;
    api.get<{ joined: boolean; participant_count: number }>(`/api/products/${id}/join`)
      .then(r => { setJoined(r.joined); setParticipantCount(r.participant_count); })
      .catch(() => {});
  }, [id, product]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dotsRef.current && !dotsRef.current.contains(e.target as Node)) setShowDots(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleDelete() {
    setShowDots(false);
    if (!confirm('상품을 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      navigate('/');
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function handleStatusToggle() {
    if (!product) return;
    const newStatus = product.status === '가능' ? '완료' : '가능';
    try {
      const updated = await api.put<Product>(`/api/products/${id}`, { status: newStatus });
      setProduct(updated);
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function handleJoinToggle() {
    setJoinLoading(true);
    try {
      const r = joined
        ? await api.delete<{ joined: boolean; participant_count: number }>(`/api/products/${id}/join`)
        : await api.post<{ joined: boolean; participant_count: number }>(`/api/products/${id}/join`, {});
      setJoined(r.joined);
      setParticipantCount(r.participant_count);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setJoinLoading(false);
    }
  }

  async function handleLaunch() {
    try {
      const list = await api.get<GroupBuyParticipant[]>(`/api/products/${id}/participants`);
      setParticipants(list);
      setShowPopup(true);
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function handleComment(e: FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    setError('');
    try {
      const newComment = await api.post<Comment>(`/api/products/${id}/comments`, { content: commentText });
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCommentLoading(false);
    }
  }

  if (loading) return <div style={styles.loadingBox}>로딩 중...</div>;
  if (!product) return null;

  const isOwner = user?.id === product.user_id;
  const isDone = product.status === '완료';
  const commentDisabled = commentLoading || !commentText.trim();
  const isFull = product.max_participants !== null && participantCount >= product.max_participants;
  const joinDisabled = joinLoading || (!joined && isFull);

  return (
    <div style={styles.page}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>← 목록으로</button>

      <div style={styles.productCard}>
        {/* ⋮ 드롭다운 - 소유자이고 완료가 아닐 때만 */}
        {isOwner && !isDone && (
          <div ref={dotsRef}>
            <button onClick={() => setShowDots(v => !v)} style={styles.dotsBtn}>⋮</button>
            {showDots && (
              <div style={styles.dotsDropdown}>
                <button style={styles.dotsDropdownItem()} onClick={() => { setShowDots(false); navigate(`/products/${id}/edit`); }}>수정</button>
                <button style={styles.dotsDropdownItem(true)} onClick={handleDelete}>삭제</button>
              </div>
            )}
          </div>
        )}

        <div style={styles.tagRow}>
          <span style={tagBadgeStyle(product.tag)}>{product.tag}</span>
          {isDone && <span style={styles.soldBadge}>완료</span>}
        </div>

        <h2 style={styles.productTitle}>{product.title}</h2>

        <div style={styles.meta}>
          <span>{product.nickname}</span>
          <span>{product.created_at.slice(0, 16)}</span>
        </div>

        {product.price !== null && (
          <div style={styles.priceRow}>
            <span style={styles.price}>{product.price.toLocaleString()}원</span>
            {product.is_negotiable === 1 && <span style={styles.negotiableBadge}>흥정 가능</span>}
          </div>
        )}

        {product.tag === '같이삽시다' && (
          <div style={styles.groupBuyInfo}>
            <span>👥 현재 참여 인원:</span>
            <span style={styles.participantCount}>
              {participantCount}명{product.max_participants !== null ? ` / ${product.max_participants}명` : ''}
            </span>
            {isFull && <span style={styles.fullBadge}>모집 완료</span>}
          </div>
        )}

        <p style={styles.description}>{product.description}</p>

        <div style={styles.actionRow}>
          {isOwner ? (
            <>
              <button onClick={handleStatusToggle} style={statusToggleBtnStyle(product.status)}>
                {product.status === '가능' ? '완료로 변경' : '가능으로 변경'}
              </button>
              {product.tag === '같이삽시다' && isFull && (
                <button onClick={handleLaunch} style={styles.launchBtn}>⚓ 출항</button>
              )}
            </>
          ) : (
            <>
              {product.tag === '같이삽시다' ? (
                <button
                  onClick={handleJoinToggle}
                  disabled={joinDisabled}
                  style={styles.joinBtn(joined, joinDisabled)}
                >
                  {joinLoading ? '처리 중...' : joined ? '🚢 배에서 하차하기' : '⛵ 한 배에 타기'}
                </button>
              ) : (
                <button disabled style={styles.messageBtn}>쪽지 보내기 (준비 중)</button>
              )}
            </>
          )}
        </div>
      </div>

      <div style={styles.commentCard}>
        <h3 style={styles.commentCardTitle}>💬 댓글 {comments.length}개</h3>

        {comments.length === 0 ? (
          <p style={styles.emptyComment}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
        ) : (
          <div style={styles.commentList}>
            {comments.map(c => (
              <div key={c.id} style={styles.commentItem}>
                <div style={styles.commentItemHeader}>
                  <span style={styles.commentNickname}>{c.nickname}</span>
                  <span style={styles.commentDate}>{c.created_at.slice(0, 16)}</span>
                </div>
                <p style={styles.commentContent}>{c.content}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleComment} style={styles.commentForm}>
          <input
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요"
            style={styles.commentInput}
          />
          <button type="submit" disabled={commentDisabled} style={commentSubmitBtnStyle(commentDisabled)}>
            등록
          </button>
        </form>
        {error && <p style={styles.commentError}>{error}</p>}
      </div>

      {showPopup && (
        <div style={styles.overlay} onClick={() => setShowPopup(false)}>
          <div style={styles.popup} onClick={e => e.stopPropagation()}>
            <h3 style={styles.popupTitle}>⚓ 출항 — 참여자 목록</h3>
            {participants.length === 0 ? (
              <p>참여자가 없습니다.</p>
            ) : (
              <ul style={styles.popupEmailList}>
                {participants.map((p, i) => (
                  <li key={i} style={styles.popupEmailItem}>
                    <strong>{p.nickname}</strong> — {p.email}
                  </li>
                ))}
              </ul>
            )}
            <div style={styles.popupActions}>
              <button onClick={() => setShowPopup(false)} style={styles.popupCloseBtn}>닫기</button>
              <button disabled style={styles.popupMailBtn}>메일 전송 (준비 중)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
