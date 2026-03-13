import type { CSSProperties } from 'react';
import { colors, radius, shadow, fonts } from '../styles/theme';

export const bubbleStyle = (isMine: boolean): CSSProperties => ({
  padding: '10px 14px',
  borderRadius: isMine ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
  background: isMine ? colors.primary : colors.white,
  color: isMine ? colors.white : colors.text,
  border: isMine ? 'none' : `1.5px solid ${colors.border}`,
  fontSize: '14px',
  lineHeight: 1.5,
  wordBreak: 'break-word' as const,
});

const styles = {
  page: {
    fontFamily: fonts.main,
    maxWidth: '680px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    height: 'calc(100vh - 60px)',
  } as CSSProperties,

  header: {
    padding: '16px 16px 12px',
    borderBottom: `1.5px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: colors.white,
    flexShrink: 0,
  } as CSSProperties,

  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: colors.primary,
    padding: '0 4px',
  } as CSSProperties,

  headerInfo: {
    flex: 1,
  } as CSSProperties,

  partnerName: {
    fontWeight: 700,
    fontSize: '15px',
    color: colors.text,
  } as CSSProperties,

  productLink: {
    fontSize: '12px',
    color: colors.primary,
    cursor: 'pointer',
    textDecoration: 'underline',
  } as CSSProperties,

  messageList: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  } as CSSProperties,

  messageRow: (isMine: boolean): CSSProperties => ({
    display: 'flex',
    justifyContent: isMine ? 'flex-end' : 'flex-start',
    alignItems: 'flex-end',
    gap: '6px',
  }),

  senderName: {
    fontSize: '11px',
    color: colors.textMuted,
    marginBottom: '3px',
  } as CSSProperties,

  msgMeta: {
    fontSize: '11px',
    color: colors.textMuted,
    flexShrink: 0,
  } as CSSProperties,

  inputRow: {
    padding: '12px 16px',
    borderTop: `1.5px solid ${colors.border}`,
    display: 'flex',
    gap: '8px',
    background: colors.white,
    flexShrink: 0,
  } as CSSProperties,

  input: {
    flex: 1,
    padding: '10px 14px',
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.md,
    fontSize: '14px',
    fontFamily: fonts.main,
    outline: 'none',
    resize: 'none' as const,
  } as CSSProperties,

  sendBtn: (disabled: boolean): CSSProperties => ({
    padding: '10px 20px',
    background: disabled ? colors.disabled : colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: radius.md,
    fontFamily: fonts.main,
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    flexShrink: 0,
  }),

  empty: {
    textAlign: 'center' as const,
    padding: '40px 0',
    color: colors.textMuted,
    fontSize: '14px',
  } as CSSProperties,

  loadingBox: {
    textAlign: 'center' as const,
    padding: '60px 0',
    color: colors.textMuted,
    fontFamily: fonts.main,
  } as CSSProperties,

  card: {
    background: colors.white,
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.md,
    padding: '16px',
    boxShadow: shadow.card,
  } as CSSProperties,
};

export default styles;
