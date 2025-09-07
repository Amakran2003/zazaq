import React from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out';
  delay?: number;
  triggerOnce?: boolean;
  threshold?: number;
}

/**
 * Composant qui s'anime lorsque l'utilisateur défile et qu'il devient visible
 */
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  className,
  triggerOnce = true,
  threshold = 0.1,
  ...props
}) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce,
  });

  const animationStyles = {
    'fade-up': {
      hidden: 'opacity-0 translate-y-16',
      visible: 'opacity-100 translate-y-0',
    },
    'fade-down': {
      hidden: 'opacity-0 -translate-y-16',
      visible: 'opacity-100 translate-y-0',
    },
    'fade-left': {
      hidden: 'opacity-0 translate-x-16',
      visible: 'opacity-100 translate-x-0',
    },
    'fade-right': {
      hidden: 'opacity-0 -translate-x-16',
      visible: 'opacity-100 translate-x-0',
    },
    'zoom-in': {
      hidden: 'opacity-0 scale-95',
      visible: 'opacity-100 scale-100',
    },
    'zoom-out': {
      hidden: 'opacity-0 scale-105',
      visible: 'opacity-100 scale-100',
    },
  };

  const visibilityClass = isVisible ? animationStyles[animation].visible : animationStyles[animation].hidden;

  return (
    <div
      ref={ref}
      className={cn(
        visibilityClass,
        'transition-all duration-700 ease-out',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
