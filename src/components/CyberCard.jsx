import { motion } from 'framer-motion';

export default function CyberCard({ children, className = '', glowColor = 'blue', animate = true, ...props }) {
  const glowMap = {
    blue: 'hover:border-blue-500/35',
    cyan: 'hover:border-cyan-500/35',
    red:  'hover:border-red-500/35',
  };

  const Wrapper = animate ? motion.div : 'div';
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      }
    : {};

  return (
    <Wrapper
      className={`relative bg-theme-card border border-theme rounded-lg transition-all duration-300 ${glowMap[glowColor]} ${className}`}
      {...animProps}
      {...props}
    >
      {/* Corner decorations */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-500/30 rounded-tl" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-500/30 rounded-tr" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-500/30 rounded-bl" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-500/30 rounded-br" />
      {children}
    </Wrapper>
  );
}
