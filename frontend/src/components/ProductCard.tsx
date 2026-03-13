import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import styles, { tagBadgeStyle, cardStyle } from './ProductCard.styles';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();

  const isDone = product.status === '완료';

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      style={cardStyle(isDone)}
      onMouseEnter={e => { if (!isDone) Object.assign((e.currentTarget as HTMLDivElement).style, styles.cardHover); }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'none';
        (e.currentTarget as HTMLDivElement).style.boxShadow = isDone ? 'none' : styles.card.boxShadow as string;
      }}
    >
      <div style={styles.tagRow}>
        <div style={styles.tagLeft}>
          <span style={tagBadgeStyle(product.tag)}>{product.tag}</span>
          {product.status === '완료' && <span style={styles.soldBadge}>완료</span>}
        </div>
        <span style={styles.date}>{product.created_at.slice(0, 10)}</span>
      </div>

      <h3 style={styles.title}>{product.title}</h3>
      {product.price !== null && product.price !== undefined && (
        <div style={styles.price}>
          {product.price.toLocaleString()}원
          {product.is_negotiable === 1 && <span style={styles.negotiable}> · 흥정 가능</span>}
        </div>
      )}
      <p style={styles.description}>{product.description}</p>

      <div style={styles.footer}>
        <span>{product.nickname}</span>
        <div style={styles.commentCount}>
          {product.tag === '같이삽시다' && (
            <span>👥 {product.participant_count ?? 0}{product.max_participants ? `/${product.max_participants}` : ''}명 &nbsp;</span>
          )}
          💬 {product.comment_count ?? 0}
        </div>
      </div>

      {product.latest_comment_content && (
        <div style={styles.latestComment}>
          💬 <strong>{product.latest_comment_nickname}</strong> {product.latest_comment_content}
        </div>
      )}
    </div>
  );
}
