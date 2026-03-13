import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Message } from '../types';
import { useAuth } from '../context/AuthContext';
import styles, { bubbleStyle } from './ConversationPage.styles';

interface ConversationData {
  messages: Message[];
  partner: { id: number; nickname: string };
}

export default function ConversationPage() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get<ConversationData>(`/api/messages/${partnerId}`)
      .then(d => { setData(d); })
      .catch(() => navigate('/messages'))
      .finally(() => setLoading(false));
  }, [partnerId, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const msg = await api.post<Message>('/api/messages', {
        receiver_id: Number(partnerId),
        content: text.trim(),
      });
      setData(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
      setText('');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div style={styles.loadingBox}>로딩 중...</div>;
  if (!data) return null;

  const productId = data.messages[0]?.product_id;
  const productTitle = data.messages[0]?.product_title;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button onClick={() => navigate('/messages')} style={styles.backBtn}>←</button>
        <div style={styles.headerInfo}>
          <div style={styles.partnerName}>{data.partner.nickname}</div>
          {productTitle && (
            <div
              style={styles.productLink}
              onClick={() => navigate(`/products/${productId}`)}
            >
              📦 {productTitle}
            </div>
          )}
        </div>
      </div>

      <div style={styles.messageList}>
        {data.messages.length === 0 ? (
          <div style={styles.empty}>아직 메시지가 없어요. 먼저 말을 걸어보세요!</div>
        ) : (
          data.messages.map(msg => {
            const isMine = msg.sender_id === user?.id;
            return (
              <div key={msg.id} style={styles.messageRow(isMine)}>
                {!isMine && (
                  <div>
                    <div style={styles.senderName}>{msg.sender_nickname}</div>
                    <div style={bubbleStyle(false)}>{msg.content}</div>
                  </div>
                )}
                {isMine && (
                  <>
                    <span style={styles.msgMeta}>{msg.created_at.slice(11, 16)}</span>
                    <div style={bubbleStyle(true)}>{msg.content}</div>
                  </>
                )}
                {!isMine && (
                  <span style={styles.msgMeta}>{msg.created_at.slice(11, 16)}</span>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={styles.inputRow}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={styles.input}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as unknown as FormEvent); } }}
        />
        <button type="submit" disabled={!text.trim() || sending} style={styles.sendBtn(!text.trim() || sending)}>
          {sending ? '전송 중' : '전송'}
        </button>
      </form>
    </div>
  );
}
