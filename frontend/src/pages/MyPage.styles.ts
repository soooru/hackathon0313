import type { CSSProperties } from 'react';
import { colors, radius, fonts } from '../styles/theme';

const styles = {
  page: {
    fontFamily: fonts.main,
    padding: '24px 16px',
    maxWidth: '900px',
    margin: '0 auto',
  } as CSSProperties,

  profileCard: {
    background: colors.white,
    border: `2px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: '28px 24px',
    marginBottom: '28px',
    boxShadow: '0 2px 12px rgba(255,107,53,0.1)',
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  } as CSSProperties,

  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: colors.primaryLight,
    border: `3px solid ${colors.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    flexShrink: 0,
  } as CSSProperties,

  profileNickname: {
    margin: '0 0 6px',
    fontSize: '20px',
    color: colors.text,
  } as CSSProperties,

  profileEmail: {
    margin: '0 0 4px',
    fontSize: '14px',
    color: colors.textMuted,
  } as CSSProperties,

  profileDate: {
    margin: 0,
    fontSize: '13px',
    color: colors.textMuted,
  } as CSSProperties,

  sectionTitle: {
    color: colors.primary,
    marginBottom: '16px',
    fontSize: '18px',
  } as CSSProperties,

  loadingBox: {
    textAlign: 'center' as const,
    padding: '60px',
    color: colors.textMuted,
  } as CSSProperties,

  emptyBox: {
    textAlign: 'center' as const,
    padding: '60px',
    color: colors.textMuted,
  } as CSSProperties,

  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  } as CSSProperties,

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
  } as CSSProperties,

  withdrawSection: {
    textAlign: 'center' as const,
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: `1px dashed #ddd`,
  } as CSSProperties,

  withdrawBtn: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    fontSize: '12px',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontFamily: 'inherit',
  } as CSSProperties,

  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  } as CSSProperties,

  dialog: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px 28px',
    width: '90%',
    maxWidth: '320px',
    textAlign: 'center' as const,
    fontFamily: 'inherit',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  } as CSSProperties,

  dialogTitle: {
    margin: '0 0 8px',
    fontSize: '20px',
  } as CSSProperties,

  dialogDesc: {
    margin: '0 0 24px',
    fontSize: '14px',
    color: '#666',
  } as CSSProperties,

  dialogActions: {
    display: 'flex',
    gap: '10px',
  } as CSSProperties,

  dialogStayBtn: {
    flex: 1,
    padding: '12px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
  } as CSSProperties,

  dialogLeaveBtn: {
    flex: 1,
    padding: '12px',
    background: '#E53E3E',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: '15px',
    cursor: 'pointer',
  } as CSSProperties,
};

export default styles;
