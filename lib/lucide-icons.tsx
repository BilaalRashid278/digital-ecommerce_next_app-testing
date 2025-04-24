// utils/lucide-icons.ts
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

export const getLucideIcon = (iconName: string, props?: React.SVGAttributes<SVGElement>) => {
  // Convert the string to PascalCase (e.g., "arrow-right" becomes "ArrowRight")
  const formattedName = iconName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') as IconName;

  const IconComponent = LucideIcons[formattedName];
  
  if (!IconComponent) {
    console.warn(`Lucide icon "${iconName}" not found`);
    return null;
  }

  return <IconComponent {...props} />;
};