import { LayoutDashboard, Package, Tag, Car } from "lucide-react";

/**
 * Constantes y configuraciones estáticas del panel de administración.
 * Define la estructura del menú lateral (NAV) y el tamaño de paginación default.
 */

export const PAGE_SIZE = 12;

// Configuración de navegación lateral del panel admin.
export const NAV = [
  { id: "dashboard",  label: "Dashboard",  Icon: LayoutDashboard, group: "Inicio"   },
  { id: "products",   label: "Productos",  Icon: Package,         group: "Catálogo" },
  { id: "categories", label: "Categorías", Icon: Tag,             group: "Catálogo" },
  { id: "vehicles",   label: "Vehículos",  Icon: Car,             group: "Catálogo" },
];

export const NAV_GROUPS = NAV.reduce((acc, item) => {
  // Agrupa entradas por sección para renderizar encabezados de menú.
  (acc[item.group] ??= []).push(item);
  return acc;
}, {});