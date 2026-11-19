import {
  Box,
  Can,
  Coffee,
  CupSoda,
  GlassWater,
  Newspaper,
  Package,
  Recycle,
} from "lucide-react";

export const CRAFT_ICONS = {
  GlassWater,
  Coffee,
  Package,
  Can,
  Box,
  CupSoda,
  Newspaper,
  Recycle,
} as const;

export type CraftIconName = keyof typeof CRAFT_ICONS;

export const CRAFT_ICON_NAMES = Object.keys(CRAFT_ICONS) as CraftIconName[];

export function isCraftIconName(value: string): value is CraftIconName {
  return Object.prototype.hasOwnProperty.call(CRAFT_ICONS, value);
}

export function CraftIcon({
  name,
  className,
}: {
  name: CraftIconName;
  className?: string;
}) {
  const Icon = CRAFT_ICONS[name];
  return <Icon className={className} aria-hidden="true" />;
}
