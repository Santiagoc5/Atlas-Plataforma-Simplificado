import { LayoutDashboard, Package, Tag, Truck } from "lucide-react";

export const PAGE_SIZE = 12;

export const NAV = [
  { id: "dashboard",  label: "Dashboard",  Icon: LayoutDashboard, group: "Inicio"   },
  { id: "products",   label: "Productos",  Icon: Package,         group: "Catálogo" },
  { id: "categories", label: "Categorías", Icon: Tag,             group: "Catálogo" },
  { id: "vehicles",   label: "Vehículos",  Icon: Truck,           group: "Catálogo" },
];

export const NAV_GROUPS = NAV.reduce((acc, item) => {
  (acc[item.group] ??= []).push(item);
  return acc;
}, {});