import type { CSSProperties } from 'react';
import { colors, radius, shadow, fonts } from '../styles/theme';

export const tagBadgeStyle = (tag: string): CSSProperties => ({
  background:
    tag === '팝니다' ? colors.tagTrade :
    tag === '삽니다' ? colors.tagExchange :
    tag === '나눕니다' ? colors.tagFree :
    tag === '같이삽시다' ? colors.tagGroupBuy :
    colors.primary,
  color: tag === '나눕니다' ? colors.text : colors.white,
  borderRadius: radius.full,
  padding: '2px 10px',
  fontSize: '12px',
  fontWeight: 700,
  flexShrink: 0,
});

export const cardStyle = (isDone: boolean): CSSProperties => ({
  background: isDone ? '#fafafa' : colors.white,
  border: `1.5px solid ${isDone ? '#ddd' : colors.border}`,
  borderRadius: radius.md,
  padding: '16px',
  cursor: 'pointer',
  boxShadow: isDone ? 'none' : shadow.card,
  transition: 'transform 0.15s, box-shadow 0.15s',
  fontFamily: fonts.main,
  opacity: isDone ? 0.72 : 1,
});

const styles = {
  card: {
    background: colors.white,
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.md,
    padding: '16px',
    cursor: 'pointer',
    boxShadow: shadow.card,
    transition: 'transform 0.15s, box-shadow 0.15s',
    fontFamily: fonts.main,
  } as CSSProperties,

  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(255,107,53,0.25)',
  } as CSSProperties,

  tagRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  } as CSSProperties,

  tagLeft: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  } as CSSProperties,

  date: {
    fontSize: '11px',
    color: colors.textMuted,
    flexShrink: 0,
  } as CSSProperties,

  soldBadge: {
    background: colors.disabled,
    color: colors.white,
    borderRadius: radius.full,
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: 700,
  } as CSSProperties,

  title: {
    margin: '0 0 6px',
    fontSize: '15px',
    fontWeight: 700,
    color: colors.text,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  price: {
    margin: '0 0 6px',
    fontSize: '14px',
    fontWeight: 700,
    color: colors.primary,
  } as CSSProperties,

  negotiable: {
    fontSize: '12px',
    fontWeight: 400,
    color: colors.textMuted,
  } as CSSProperties,

  description: {
    margin: '0 0 10px',
    fontSize: '13px',
    color: colors.textMuted,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: colors.textMuted,
    marginBottom: '8px',
  } as CSSProperties,

  commentCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '12px',
    color: colors.textMuted,
  } as CSSProperties,

  latestComment: {
    fontSize: '12px',
    color: colors.textMuted,
    borderTop: `1px dashed ${colors.border}`,
    paddingTop: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,
};

export default styles;
