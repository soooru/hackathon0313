import type { CSSProperties } from 'react';
import { colors, radius, fonts } from '../styles/theme';

export const submitBtnStyle = (disabled: boolean): CSSProperties => ({
  width: '100%',
  padding: '12px',
  background: disabled ? colors.disabled : colors.primary,
  color: colors.white,
  border: 'none',
  borderRadius: radius.sm,
  fontSize: '16px',
  fontWeight: 700,
  fontFamily: fonts.main,
  cursor: disabled ? 'not-allowed' : 'pointer',
});

const styles = {
  page: {
    minHeight: '100vh',
    background: `${colors.bg} repeating-linear-gradient(45deg, rgba(255,107,53,0.04) 0px, rgba(255,107,53,0.04) 2px, transparent 2px, transparent 20px)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: fonts.main,
  } as CSSProperties,

  card: {
    background: colors.white,
    border: `2px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: '40px 36px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 20px rgba(255,107,53,0.15)',
  } as CSSProperties,

  pageTitle: {
    textAlign: 'center' as const,
    color: colors.primary,
    marginBottom: '8px',
    fontSize: '24px',
  } as CSSProperties,

  pageSubtitle: {
    textAlign: 'center' as const,
    color: colors.textMuted,
    marginBottom: '28px',
    fontSize: '14px',
  } as CSSProperties,

  fieldGroup: {
    marginBottom: '16px',
  } as CSSProperties,

  fieldGroupLast: {
    marginBottom: '20px',
  } as CSSProperties,

  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: colors.text,
  } as CSSProperties,

  input: {
    width: '100%',
    padding: '10px 12px',
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.sm,
    fontSize: '14px',
    fontFamily: fonts.main,
    outline: 'none',
    boxSizing: 'border-box' as const,
  } as CSSProperties,

  errorText: {
    color: colors.error,
    fontSize: '13px',
    marginBottom: '12px',
    textAlign: 'center' as const,
  } as CSSProperties,

  footer: {
    textAlign: 'center' as const,
    marginTop: '20px',
    fontSize: '13px',
    color: colors.textMuted,
  } as CSSProperties,

  link: {
    color: colors.primary,
    fontWeight: 600,
  } as CSSProperties,
};

export default styles;
