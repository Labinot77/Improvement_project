export const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
export const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } };