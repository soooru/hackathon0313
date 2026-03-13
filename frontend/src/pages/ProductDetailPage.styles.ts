import type { CSSProperties } from 'react';
import { colors, radius, fonts } from '../styles/theme';

export const tagBadgeStyle = (tag: string): CSSProperties => ({
  background:
    tag === '팝니다' ? colors.tagTrade :
    tag === '삽니다' ? colors.tagExchange :
    tag === '나눕니다' ? colors.tagFree :
    tag === '같이삽시다' ? colors.tagGroupBuy :
    colors.primary,
  color: tag === '나눕니다' ? colors.text : colors.white,
  borderRadius: radius.full,
  padding: '3px 12px',
  fontSize: '12px',
  fontWeight: 700,
});

export const commentSubmitBtnStyle = (disabled: boolean): CSSProperties => ({
  padding: '10px 20px',
  background: disabled ? colors.disabled : colors.primary,
  color: colors.white,
  border: 'none',
  borderRadius: radius.sm,
  fontFamily: fonts.main,
  fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '14px',
  whiteSpace: 'nowrap' as const,
});

export const statusToggleBtnStyle = (currentStatus: string): CSSProperties => ({
  padding: '10px 20px',
  background: currentStatus === '가능' ? colors.success : colors.white,
  color: currentStatus === '가능' ? colors.white : colors.success,
  border: `1.5px solid ${colors.success}`,
  borderRadius: radius.sm,
  fontFamily: fonts.main,
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '14px',
});

const styles = {
  page: {
    fontFamily: fonts.main,
    padding: '24px 16px',
    maxWidth: '700px',
    margin: '0 auto',
  } as CSSProperties,

  backBtn: {
    background: 'none',
    border: 'none',
    color: colors.primary,
    cursor: 'pointer',
    fontFamily: fonts.main,
    fontSize: '14px',
    marginBottom: '16px',
    padding: 0,
  } as CSSProperties,

  productCard: {
    background: colors.white,
    border: `2px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: '28px 24px',
    boxShadow: '0 2px 12px rgba(255,107,53,0.1)',
    marginBottom: '20px',
    position: 'relative' as const,
  } as CSSProperties,

  tagRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '12px',
  } as CSSProperties,

  soldBadge: {
    background: colors.disabled,
    color: colors.white,
    borderRadius: radius.full,
    padding: '3px 12px',
    fontSize: '12px',
    fontWeight: 700,
  } as CSSProperties,

  productTitle: {
    margin: '0 0 12px',
    fontSize: '22px',
    fontWeight: 700,
    color: colors.text,
  } as CSSProperties,

  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: colors.textMuted,
    marginBottom: '20px',
  } as CSSProperties,

  description: {
    fontSize: '15px',
    color: colors.text,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap' as const,
    marginBottom: '24px',
  } as CSSProperties,

  actionRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  } as CSSProperties,

  messageBtn: {
    padding: '10px 20px',
    background: colors.disabled,
    color: colors.white,
    border: 'none',
    borderRadius: radius.sm,
    fontFamily: fonts.main,
    fontWeight: 600,
    cursor: 'not-allowed',
    fontSize: '14px',
    opacity: 0.6,
  } as CSSProperties,

  editBtn: {
    padding: '10px 20px',
    background: colors.white,
    color: colors.primary,
    border: `1.5px solid ${colors.primary}`,
    borderRadius: radius.sm,
    fontFamily: fonts.main,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
  } as CSSProperties,

  deleteBtn: {
    padding: '10px 20px',
    background: colors.white,
    color: colors.error,
    border: `1.5px solid ${colors.error}`,
    borderRadius: radius.sm,
    fontFamily: fonts.main,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
  } as CSSProperties,

  commentCard: {
    background: colors.white,
    border: `2px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: '24px',
    boxShadow: '0 2px 12px rgba(255,107,53,0.1)',
  } as CSSProperties,

  commentCardTitle: {
    margin: '0 0 20px',
    color: colors.text,
    fontSize: '16px',
  } as CSSProperties,

  emptyComment: {
    color: colors.textMuted,
    fontSize: '14px',
    textAlign: 'center' as const,
    padding: '20px 0',
  } as CSSProperties,

  commentList: {
    marginBottom: '20px',
  } as CSSProperties,

  commentItem: {
    borderBottom: `1px solid ${colors.primaryLight}`,
    padding: '12px 0',
  } as CSSProperties,

  commentItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  } as CSSProperties,

  commentNickname: {
    fontWeight: 700,
    fontSize: '13px',
    color: colors.primary,
  } as CSSProperties,

  commentDate: {
    fontSize: '12px',
    color: colors.textMuted,
  } as CSSProperties,

  commentContent: {
    margin: 0,
    fontSize: '14px',
    color: colors.text,
  } as CSSProperties,

  commentForm: {
    display: 'flex',
    gap: '8px',
  } as CSSProperties,

  commentInput: {
    flex: 1,
    padding: '10px 12px',
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.sm,
    fontSize: '14px',
    fontFamily: fonts.main,
    outline: 'none',
  } as CSSProperties,

  commentError: {
    color: colors.error,
    fontSize: '13px',
    marginTop: '8px',
  } as CSSProperties,

  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  } as CSSProperties,

  price: {
    fontSize: '20px',
    fontWeight: 700,
    color: colors.primary,
  } as CSSProperties,

  negotiableBadge: {
    background: colors.primaryLight,
    color: colors.primary,
    borderRadius: radius.full,
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: 600,
  } as CSSProperties,

  groupBuyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    color: colors.text,
  } as CSSProperties,

  participantCount: {
    fontWeight: 700,
    color: colors.primary,
  } as CSSProperties,

  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  } as CSSProperties,

  popup: {
    background: colors.white,
    border: `2px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: '28px 24px',
    minWidth: '320px',
    maxWidth: '480px',
    width: '90%',
    fontFamily: fonts.main,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  } as CSSProperties,

  popupTitle: {
    margin: '0 0 16px',
    fontSize: '18px',
    fontWeight: 700,
    color: colors.text,
  } as CSSProperties,

  popupEmailList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 20px',
    borderTop: `1px solid ${colors.border}`,
  } as CSSProperties,

  popupEmailItem: {
    padding: '10px 0',
    borderBottom: `1px solid ${colors.border}`,
    fontSize: '14px',
    color: colors.text,
  } as CSSProperties,

  popupActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  } as CSSProperties,

  dotsBtn: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: colors.textMuted,
    lineHeight: 1,
    padding: '4px 8px',
  } as CSSProperties,

  dotsDropdown: {
    position: 'absolute' as const,
    top: '40px',
    right: '12px',
    background: colors.white,
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.md,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    zIndex: 50,
    overflow: 'hidden',
    minWidth: '110px',
  } as CSSProperties,

  dotsDropdownItem: (danger?: boolean): CSSProperties => ({
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    textAlign: 'left' as const,
    fontFamily: fonts.main,
    fontSize: '14px',
    color: danger ? colors.error : colors.text,
    cursor: 'pointer',
  }),

  launchBtn: {
    padding: '10px 20px',
    background: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: radius.sm,
    fontFamily: fonts.main,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '14px',
  } as CSSProperties,

  popupCloseBtn: {
    padding: '8px 16px',
    background: colors.white,
    color: colors.text,
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.sm,
    fontFamily: fonts.main,
    cursor: 'pointer',
    fontSize: '14px',
  } as CSSProperties,

  popupMailBtn: {
    padding: '8px 16px',
    background: colors.disabled,
    color: colors.white,
    border: 'none',
    borderRadius: radius.sm,
    fontFamily: fonts.main,
    fontWeight: 700,
    cursor: 'not-allowed',
    fontSize: '14px',
    opacity: 0.7,
  } as CSSProperties,

  joinBtn: (joined: boolean, disabled: boolean): CSSProperties => ({
    padding: '10px 20px',
    background: joined ? colors.white : colors.primary,
    color: joined ? colors.primary : colors.white,
    border: `1.5px solid ${colors.primary}`,
    borderRadius: radius.sm,
    fontFamily: fonts.main,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    opacity: disabled ? 0.5 : 1,
  }),

  fullBadge: {
    color: colors.error,
    fontSize: '13px',
    fontWeight: 600,
  } as CSSProperties,

  loadingBox: {
    textAlign: 'center' as const,
    padding: '80px',
    fontFamily: fonts.main,
    color: colors.textMuted,
  } as CSSProperties,
};

export default styles;
