import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variant, Transition, UseInViewOptions } from 'framer-motion';

interface InViewProps {
  children: ReactNode;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  className?: string;
}

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions,
  className = '',
}: InViewProps) {
  const ref = useRef(null);
  // Add root margin to viewOptions to ensure proper scroll detection
  const viewOptionsWithDefaults = {
    once: false,
    margin: '0px',
    amount: 0.1,
    ...viewOptions,
  };
  const isInView = useInView(ref, viewOptionsWithDefaults);

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
      style={{ position: 'relative' }}
    >
      {children}
    </motion.div>
  );
}

export default InView;

