import type { CSSProperties } from 'react';
import { colors, fonts, shadow, radius } from '../styles/theme';

export const tabStyle = (isActive: boolean): CSSProperties => ({
  padding: '8px 16px',
  borderRadius: '8px 8px 0 0',
  background: isActive ? colors.primary : 'transparent',
  color: isActive ? colors.white : colors.text,
  textDecoration: 'none',
  fontFamily: fonts.main,
  fontWeight: isActive ? 700 : 400,
  fontSize: '14px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s',
  whiteSpace: 'nowrap' as const,
});

const styles = {
  nav: {
    background: colors.white,
    borderBottom: `2px solid ${colors.primary}`,
    boxShadow: shadow.nav,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  } as CSSProperties,

  inner: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '4px',
    height: '52px',
  } as CSSProperties,

  logo: {
    fontFamily: fonts.main,
    fontWeight: 700,
    fontSize: '18px',
    color: colors.primary,
    marginRight: '12px',
    paddingBottom: '8px',
  } as CSSProperties,

  disabledTab: {
    ...tabStyle(false),
    opacity: 0.45,
    pointerEvents: 'none' as const,
    userSelect: 'none' as const,
    cursor: 'not-allowed',
  } as CSSProperties,

  disabledTabLabel: {
    fontSize: '11px',
  } as CSSProperties,

  spacer: {
    flex: 1,
  } as CSSProperties,

  // 닉네임 드롭다운
  userMenuWrapper: {
    position: 'relative' as const,
    marginBottom: '4px',
  } as CSSProperties,

  userBtn: {
    background: 'transparent',
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.full,
    padding: '5px 14px',
    fontFamily: fonts.main,
    fontSize: '13px',
    fontWeight: 600,
    color: colors.primary,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    marginTop: '6px',
    background: colors.white,
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.md,
    boxShadow: '0 4px 16px rgba(255,107,53,0.15)',
    minWidth: '130px',
    zIndex: 200,
    overflow: 'hidden',
  } as CSSProperties,

  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    textAlign: 'left' as const,
    fontFamily: fonts.main,
    fontSize: '14px',
    color: colors.text,
    cursor: 'pointer',
  } as CSSProperties,

  // 모바일
  mobileInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: '52px',
  } as CSSProperties,

  mobileLeft: {
    position: 'relative' as const,
    width: '40px',
  } as CSSProperties,

  mobileRight: {
    position: 'relative' as const,
    width: '40px',
    display: 'flex',
    justifyContent: 'flex-end',
  } as CSSProperties,

  mobileLogo: {
    fontFamily: fonts.main,
    fontWeight: 700,
    fontSize: '17px',
    color: colors.primary,
    cursor: 'pointer',
    userSelect: 'none' as const,
  } as CSSProperties,

  iconBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px',
    lineHeight: 1,
  } as CSSProperties,

  mobileDropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '6px',
    background: colors.white,
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.md,
    boxShadow: '0 4px 16px rgba(255,107,53,0.15)',
    minWidth: '150px',
    zIndex: 200,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  } as CSSProperties,

  mobileDisabledTab: {
    display: 'block',
    padding: '10px 16px',
    fontFamily: fonts.main,
    fontSize: '14px',
    color: colors.textMuted,
    opacity: 0.5,
    userSelect: 'none' as const,
  } as CSSProperties,
};

export default styles;
