import {
  Activity,
  BookOpen,
  LayoutGrid,
  ListChecks,
  Moon,
  Pencil,
  UtensilsCrossed,
} from "lucide-react";

export const NAV = [
  { title: "Overview", href: "/main", icon: LayoutGrid },
  { title: "Lessons", href: "/lessons", icon: BookOpen },
  { title: "Activity", href: "/activity", icon: Activity },
  { title: "Recipes", href: "/recipes", icon: UtensilsCrossed },
  { title: "To-dos", href: "/progress", icon: ListChecks },
  { title: "Journal", href: "/journal", icon: Pencil},
  { title: "Sleep", href: "/sleep", icon: Moon },
];
