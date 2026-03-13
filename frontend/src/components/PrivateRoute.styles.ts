import type { CSSProperties } from 'react';
import { colors, fonts } from '../styles/theme';

const styles = {
  loadingWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  } as CSSProperties,

  loadingText: {
    color: colors.primary,
    fontFamily: fonts.main,
  } as CSSProperties,
};

export default styles;
