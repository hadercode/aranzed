import type { ReactNode } from "react";
import {
  Home,
  Building2,
  User,
  FolderTree,
  ShoppingCart,
  ShoppingBag,
  Boxes,
  Users,
} from "lucide-react";

export interface NavItemConfig {
  title: string;
  path: string;
  icon?: ReactNode;
  matchPaths?: string[];
  roles?: string[];
  permissions?: string[];
}

export interface NavGroupConfig {
  title: string;
  icon: ReactNode;
  children: NavItemConfig[];
  roles?: string[];
  permissions?: string[];
}

export type NavEntryConfig = NavItemConfig | NavGroupConfig;

export function isNavGroup(entry: NavEntryConfig): entry is NavGroupConfig {
  return (
    "children" in entry && Array.isArray((entry as NavGroupConfig).children)
  );
}

export const navigationConfig: NavEntryConfig[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-[#22B2B8] dark:bg-cyan-500/25 dark:text-[#38D5DB] flex items-center justify-center shrink-0">
        <Home className="w-4 h-4" />
      </div>
    ),
  },
  {
    title: "Empresa",
    path: "/company",
    matchPaths: ["/company", "/settings"],
    icon: (
      <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-[#F97316] dark:bg-orange-500/25 dark:text-[#FB923C] flex items-center justify-center shrink-0">
        <Building2 className="w-4 h-4" />
      </div>
    ),
  },
  {
    title: "Mi Perfil",
    path: "/profile",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-[#8B5CF6] dark:bg-purple-500/25 dark:text-[#A78BFA] flex items-center justify-center shrink-0">
        <User className="w-4 h-4" />
      </div>
    ),
  },
  {
    title: "Catálogo",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-[#F59E0B] dark:bg-amber-500/25 dark:text-[#FBBF24] flex items-center justify-center shrink-0">
        <FolderTree className="w-4 h-4" />
      </div>
    ),
    children: [
      {
        title: "Productos",
        path: "/catalog/products",
        matchPaths: ["/catalog/products", "/products"],
        permissions: ["products:read"],
      },
      {
        title: "Recetas / BOM",
        path: "/catalog/recipes",
        matchPaths: ["/catalog/recipes", "/recipes"],
        permissions: ["recipes:read"],
      },
      {
        title: "Categorías",
        path: "/catalog/categories",
        matchPaths: ["/catalog/categories", "/categories"],
        permissions: ["categories:read"],
      },
      {
        title: "Unidades de Medida",
        path: "/catalog/units-of-measure",
        matchPaths: [
          "/catalog/units-of-measure",
          "/catalog/uofm",
          "/units-of-measure",
        ],
        permissions: ["uofm:read"],
      },
    ],
  },
  {
    title: "Compras",
    path: "/purchases",
    matchPaths: ["/purchases", "/purchases/new"],
    icon: (
      <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-[#22B2B8] dark:bg-cyan-500/25 dark:text-[#38D5DB] flex items-center justify-center shrink-0">
        <ShoppingCart className="w-4 h-4" />
      </div>
    ),
    permissions: ["purchases:read"],
  },
  {
    title: "Ventas",
    path: "/sales",
    matchPaths: ["/sales", "/sales/new", "/sales/:id", "/sales/:id/edit"],
    icon: (
      <div className="w-7 h-7 rounded-lg bg-pink-500/15 text-[#F43F5E] dark:bg-pink-500/25 dark:text-[#FB7185] flex items-center justify-center shrink-0">
        <ShoppingBag className="w-4 h-4" />
      </div>
    ),
    permissions: ["sales:read"],
    children: [
      {
        title: "Productos",
        path: "/sales",
        matchPaths: ["/sales", "/sales/new", "/sales/:id", "/sales/:id/edit"],
        permissions: ["sales:read"],
      },
      {
        title: "Cobros",
        path: "/sales/payments",
        matchPaths: [
          "/sales/payments",
          "/sales/payments/new",
          "/sales/payments/:id",
          "/sales/payments/:id/edit",
        ],
        permissions: ["sales:read"],
      },
    ],
  },
  {
    title: "Inventario",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-[#F59E0B] dark:bg-amber-500/25 dark:text-[#FBBF24] flex items-center justify-center shrink-0">
        <Boxes className="w-4 h-4" />
      </div>
    ),
    children: [
      {
        title: "Existencias y Saldos",
        path: "/inventory/stocks",
        matchPaths: ["/inventory/stocks", "/inventory"],
      },
      {
        title: "Movimientos",
        path: "/inventory/transactions",
        matchPaths: ["/inventory/transactions", "/inventory/transactions/new"],
      },
      {
        title: "Almacenes",
        path: "/inventory/warehouses",
        matchPaths: ["/inventory/warehouses"],
      },
      {
        title: "Motivos",
        path: "/inventory/reasons",
        matchPaths: ["/inventory/reasons"],
      },
      {
        title: "Libro Kárdex",
        path: "/inventory/ledger",
        matchPaths: ["/inventory/ledger"],
      },
      {
        title: "Reporte de Mermas",
        path: "/inventory/adjustments-report",
        matchPaths: ["/inventory/adjustments-report"],
      },
    ],
  },
  {
    title: "IAM",
    icon: (
      <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-[#8B5CF6] dark:bg-purple-500/25 dark:text-[#A78BFA] flex items-center justify-center shrink-0">
        <Users className="w-4 h-4" />
      </div>
    ),
    children: [
      {
        title: "Users Management",
        path: "/users",
      },
      {
        title: "Roles",
        path: "/roles",
      },
      {
        title: "Permissions Matrix",
        path: "/permissions",
      },
      {
        title: "Audit Logs",
        path: "/audit",
      },
    ],
  },
];
