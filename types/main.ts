export interface DashboardCardProps {
  index: number;
  title: string;
  subtitle: string;
  emoji: string;
  href: string;
  accentGlow: string;
  size?: "large" | "medium" | "small";
  className?: string;
};
