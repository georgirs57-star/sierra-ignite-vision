// Matières partagées STEM / Discover
import {
  Sigma,
  FlaskConical,
  Leaf,
  Cpu,
  Code2,
  Landmark,
  BookOpen,
  Languages,
  Globe2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type Subject = { key: string; label: string; icon: LucideIcon };

export const SUBJECTS: Subject[] = [
  { key: "Tout", label: "Pour toi", icon: Sparkles },
  { key: "Mathématiques", label: "Mathématiques", icon: Sigma },
  { key: "Physique-Chimie", label: "Physique-Chimie", icon: FlaskConical },
  { key: "SVT", label: "SVT", icon: Leaf },
  { key: "Technologie", label: "Technologie", icon: Cpu },
  { key: "Informatique", label: "Informatique", icon: Code2 },
  { key: "Histoire-Géographie", label: "Histoire-Géo", icon: Landmark },
  { key: "Français", label: "Français", icon: BookOpen },
  { key: "Anglais", label: "Anglais", icon: Languages },
  { key: "Philosophie", label: "Philosophie", icon: Globe2 },
];

export const LEVELS = [
  "6e", "5e", "4e", "3e",
  "Seconde A", "Seconde C",
  "Première A", "Première C", "Première D",
  "Terminale A", "Terminale C", "Terminale D",
] as const;
