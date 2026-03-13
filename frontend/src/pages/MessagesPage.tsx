import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Conversation } from '../types';
import styles from './MessagesPage.styles';

export default function MessagesPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Conversation[]>('/api/messages')
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>📬 쪽지함</h2>

      {loading ? (
        <div style={styles.empty}>로딩 중...</div>
      ) : conversations.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>✉️</div>
          <p>아직 주고받은 쪽지가 없어요!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {conversations.map(conv => (
            <div
              key={conv.partner_id}
              style={styles.item}
              onClick={() => navigate(`/messages/${conv.partner_id}`)}
            >
              <div style={styles.itemLeft}>
                <div style={styles.itemTop}>
                  <span style={styles.nickname}>{conv.partner_nickname}</span>
                  {conv.product_title && (
                    <span style={styles.productTag}>📦 {conv.product_title}</span>
                  )}
                </div>
                <div style={styles.lastMsg}>{conv.last_content}</div>
              </div>
              <div style={styles.itemRight}>
                <span style={styles.date}>{conv.last_created_at.slice(0, 10)}</span>
                {conv.unread_count > 0 && (
                  <span style={styles.unreadBadge}>{conv.unread_count}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
