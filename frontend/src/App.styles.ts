import type { CSSProperties } from 'react';
import { colors } from './styles/theme';

const styles = {
  layout: {
    minHeight: '100vh',
    background: `${colors.bg} repeating-linear-gradient(45deg, rgba(255,107,53,0.03) 0px, rgba(255,107,53,0.03) 2px, transparent 2px, transparent 20px)`,
  } as CSSProperties,
};

export default styles;
