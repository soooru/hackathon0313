// 공유 스타일: ProductCreatePage, ProductEditPage
import type { CSSProperties } from 'react';
import { colors, radius, fonts } from '../styles/theme';

export const submitBtnStyle = (disabled: boolean): CSSProperties => ({
  flex: 2,
  padding: '12px',
  background: disabled ? colors.disabled : colors.primary,
  color: colors.white,
  border: 'none',
  borderRadius: radius.sm,
  fontFamily: fonts.main,
  fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '15px',
});

const styles = {
  page: {
    fontFamily: fonts.main,
    padding: '32px 16px',
    maxWidth: '600px',
    margin: '0 auto',
  } as CSSProperties,

  pageTitle: {
    color: colors.primary,
    marginBottom: '24px',
    fontSize: '22px',
  } as CSSProperties,

  card: {
    background: colors.white,
    border: `2px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: '28px 24px',
    boxShadow: '0 2px 12px rgba(255,107,53,0.1)',
  } as CSSProperties,

  fieldGroup: {
    marginBottom: '20px',
  } as CSSProperties,

  fieldGroupLast: {
    marginBottom: '28px',
  } as CSSProperties,

  label: {
    display: 'block',
    marginBottom: '8px',
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

  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.sm,
    fontSize: '14px',
    fontFamily: fonts.main,
    outline: 'none',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const,
    minHeight: '120px',
  } as CSSProperties,

  radioGroup: {
    display: 'flex',
    gap: '12px',
  } as CSSProperties,

  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontFamily: fonts.main,
    fontSize: '14px',
  } as CSSProperties,

  radioInput: {
    accentColor: colors.primary,
  } as CSSProperties,

  priceRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  } as CSSProperties,

  priceInput: {
    flex: 1,
    padding: '10px 12px',
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.sm,
    fontSize: '14px',
    fontFamily: fonts.main,
    outline: 'none',
    boxSizing: 'border-box' as const,
  } as CSSProperties,

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontFamily: fonts.main,
    fontSize: '14px',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  checkboxInput: {
    accentColor: colors.primary,
    width: '16px',
    height: '16px',
  } as CSSProperties,

  hint: {
    fontSize: '12px',
    color: colors.textMuted,
    marginTop: '4px',
  } as CSSProperties,

  errorText: {
    color: colors.error,
    fontSize: '13px',
    marginBottom: '12px',
  } as CSSProperties,

  actionRow: {
    display: 'flex',
    gap: '12px',
  } as CSSProperties,

  cancelBtn: {
    flex: 1,
    padding: '12px',
    background: colors.white,
    color: colors.text,
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.sm,
    fontFamily: fonts.main,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '15px',
  } as CSSProperties,

  loadingBox: {
    textAlign: 'center' as const,
    padding: '80px',
    fontFamily: fonts.main,
    color: colors.textMuted,
  } as CSSProperties,
};

export default styles;
