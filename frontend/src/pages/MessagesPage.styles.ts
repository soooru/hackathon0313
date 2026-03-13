import type { CSSProperties } from 'react';
import { colors, radius, shadow, fonts } from '../styles/theme';

const styles = {
  page: {
    fontFamily: fonts.main,
    padding: '24px 16px',
    maxWidth: '680px',
    margin: '0 auto',
  } as CSSProperties,

  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: colors.text,
    marginBottom: '20px',
  } as CSSProperties,

  empty: {
    textAlign: 'center' as const,
    padding: '80px 0',
    color: colors.textMuted,
    fontSize: '15px',
  } as CSSProperties,

  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  } as CSSProperties,

  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  } as CSSProperties,

  item: {
    background: colors.white,
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.md,
    padding: '14px 16px',
    cursor: 'pointer',
    boxShadow: shadow.card,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  } as CSSProperties,

  itemLeft: {
    flex: 1,
    minWidth: 0,
  } as CSSProperties,

  itemTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  } as CSSProperties,

  nickname: {
    fontWeight: 700,
    fontSize: '14px',
    color: colors.text,
  } as CSSProperties,

  productTag: {
    fontSize: '11px',
    color: colors.textMuted,
    background: colors.primaryLight,
    borderRadius: radius.full,
    padding: '1px 8px',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  lastMsg: {
    fontSize: '13px',
    color: colors.textMuted,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  itemRight: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '6px',
    flexShrink: 0,
  } as CSSProperties,

  date: {
    fontSize: '11px',
    color: colors.textMuted,
  } as CSSProperties,

  unreadBadge: {
    background: colors.primary,
    color: colors.white,
    borderRadius: radius.full,
    padding: '1px 7px',
    fontSize: '11px',
    fontWeight: 700,
  } as CSSProperties,
};

export default styles;
