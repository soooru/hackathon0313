import type { CSSProperties } from 'react';
import { colors, radius, fonts } from '../styles/theme';

export const tagBtnStyle = (isActive: boolean): CSSProperties => ({
  padding: '6px 16px',
  background: isActive ? colors.primary : colors.white,
  color: isActive ? colors.white : colors.text,
  border: `1.5px solid ${isActive ? colors.primary : colors.border}`,
  borderRadius: radius.full,
  fontFamily: fonts.main,
  fontWeight: isActive ? 700 : 400,
  cursor: 'pointer',
  fontSize: '13px',
});

export const pageBtnStyle = (isActive: boolean): CSSProperties => ({
  width: '36px',
  height: '36px',
  background: isActive ? colors.primary : colors.white,
  color: isActive ? colors.white : colors.text,
  border: `1.5px solid ${isActive ? colors.primary : colors.border}`,
  borderRadius: radius.sm,
  fontFamily: fonts.main,
  fontWeight: isActive ? 700 : 400,
  cursor: 'pointer',
  fontSize: '14px',
});

const styles = {
  page: {
    fontFamily: fonts.main,
    padding: '24px 16px',
    maxWidth: '900px',
    margin: '0 auto',
  } as CSSProperties,

  searchRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  } as CSSProperties,

  searchInput: {
    flex: 1,
    padding: '10px 14px',
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.md,
    fontSize: '14px',
    fontFamily: fonts.main,
    outline: 'none',
  } as CSSProperties,

  searchBtn: {
    padding: '10px 20px',
    background: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: radius.md,
    fontFamily: fonts.main,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '14px',
  } as CSSProperties,

  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  } as CSSProperties,

  showDoneLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: colors.textMuted,
    cursor: 'pointer',
    fontFamily: fonts.main,
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  showDoneCheckbox: {
    accentColor: colors.primary,
    width: '15px',
    height: '15px',
    cursor: 'pointer',
  } as CSSProperties,

  addBtn: {
    marginLeft: 'auto',
    padding: '6px 20px',
    background: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: radius.full,
    fontFamily: fonts.main,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '13px',
  } as CSSProperties,

  countText: {
    fontSize: '13px',
    color: colors.textMuted,
    marginBottom: '16px',
  } as CSSProperties,

  loadingBox: {
    textAlign: 'center' as const,
    padding: '60px 0',
    color: colors.textMuted,
  } as CSSProperties,

  emptyBox: {
    textAlign: 'center' as const,
    padding: '80px 0',
    color: colors.textMuted,
    fontSize: '16px',
  } as CSSProperties,

  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  } as CSSProperties,

  emptyBtn: {
    marginTop: '16px',
    padding: '10px 24px',
    background: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: radius.md,
    fontFamily: fonts.main,
    fontWeight: 700,
    cursor: 'pointer',
  } as CSSProperties,

  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    marginBottom: '32px',
  } as CSSProperties,

  paginationRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '16px',
  } as CSSProperties,
};

export default styles;
