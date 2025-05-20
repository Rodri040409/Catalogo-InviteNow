import { animated, useSprings } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

interface BlurTextProps {
  text: string;
  delay: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  onAnimationComplete?: () => void; // Asegúrate de agregar esta propiedad
}

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
}: BlurTextProps) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null); // Definir tipo correctamente

  const defaultFrom =
    direction === 'top'
      ? {
          filter: 'blur(10px)',
          opacity: 0,
          transform: 'translate3d(0,-50px,0)',
        }
      : {
          filter: 'blur(10px)',
          opacity: 0,
          transform: 'translate3d(0,50px,0)',
        };

  const defaultTo = [
    {
      filter: 'blur(5px)',
      opacity: 0.5,
      transform:
        direction === 'top' ? 'translate3d(0,5px,0)' : 'translate3d(0,-5px,0)',
    },
    { filter: 'blur(0px)', opacity: 1, transform: 'translate3d(0,0,0)' },
  ];

  useEffect(() => {
    console.log('Observer iniciado'); // Asegurarse que el observer funcione
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && ref.current) {
        // Verificar que ref.current no sea null
        setInView(true);
        observer.unobserve(ref.current);
      }
    });

    if (ref.current) {
      observer.observe(ref.current); // Verificar que ref.current no sea null
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
      observer.disconnect();
    };
  }, []);

  const springs = useSprings(
    elements.length,
    elements.map((_, i) => ({
      from: defaultFrom,
      to: inView
        ? async (next: any) => {
            for (const step of defaultTo) {
              await next(step);
            }
          }
        : defaultFrom,
      delay: i * delay,
    })),
  );

  return (
    <p ref={ref} className={`${className}`}>
      {springs.map((props, index) => (
        <animated.span
          key={index}
          style={{
            ...props,
            display: 'inline-block',
            willChange: 'transform, filter, opacity',
          }}
        >
          {elements[index] === ' ' ? '\u00A0' : elements[index]}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </animated.span>
      ))}
    </p>
  );
};

export default BlurText;
