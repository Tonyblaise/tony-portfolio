import { useEffect, useRef } from 'react';

const defaultOptions: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: '0px 0px -48px 0px',
};

/** Reveals a single element when it enters the viewport. */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('is-visible');
        observer.disconnect();
      }
    }, { ...defaultOptions, ...options });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/** Stagger-reveals the direct children of the container element. */
export function useScrollRevealStagger<T extends HTMLElement = HTMLDivElement>(
  staggerMs = 80,
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('is-visible'), i * staggerMs);
        });
        observer.disconnect();
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -48px 0px', ...options });

    observer.observe(container);
    return () => observer.disconnect();
  }, [staggerMs]);

  return ref;
}
