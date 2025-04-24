// components/DynamicIcon.tsx
"use client"

import { getLucideIcon } from "@/lib/lucide-icons";

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const DynamicIcon = ({
  name,
  className = "",
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: DynamicIconProps) => {
  const icon = getLucideIcon(name, {
    className,
    width: size,
    height: size,
    color,
    strokeWidth,
  });

  return icon;
};