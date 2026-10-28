import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useAuthStore, type User } from '@/shared/hooks/store/useAuthStore';
import {
  Home,
  Building2,
  User as UserIcon,
  ShoppingBag,
  ShoppingCart,
  Boxes,
  Layers,
  Tag,
  Scale,
  Users,
  ShieldCheck,
  KeyRound,
  FileText,
  CreditCard,
  PlusCircle,
  Truck,
  ClipboardList,
  Sparkles,
} from 'lucide-react';

export interface PermittedNavItem {
  id: string;
  title: string;
  section: string;
  path: string;
  description: string;
  icon: ReactNode;
  keywords: string[];
  permissions?: string[];
  roles?: string[];
  isQuickAction?: boolean;
}

export function checkUserAccess(
  user: User | null,
  requiredPermissions?: string[],
  requiredRoles?: string[]
): boolean {
  if (!user) return false;

  const userRoles = user.roles || [];
  const userPerms = user.permissions || [];

  const isAdmin =
    userRoles.includes('ADMIN_ROLE') ||
    userRoles.includes('ADMIN') ||
    userPerms.includes('*') ||
    userPerms.includes('all');

  if (isAdmin) return true;

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = requiredRoles.some((r) => userRoles.includes(r));
    if (!hasRole) return false;
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPerm = requiredPermissions.some((p) =>
      userPerms.some((userP) => userP === p || userP.startsWith(p.split(':')[0] + ':'))
    );
    if (!hasPerm) return false;
  }

  return true;
}

const ALL_SYSTEM_NAV_ITEMS: PermittedNavItem[] = [
  // Accesos Rápidos Operativos
  {
    id: 'quick-new-sale',
    title: '+ Nueva Venta',
    section: 'Accesos Rápidos',
    path: '/sales/new',
    description: 'Crear una nueva venta comercial o cotización en mostrador',
    icon: <PlusCircle className="w-4 h-4 text-[#F43F5E]" />,
    keywords: ['nueva venta', 'vender', 'cotizar', 'pedido', 'cobro', 'ticket', 'factura', 'cliente'],
    permissions: ['sales:read'],
    isQuickAction: true,
  },
  {
    id: 'quick-new-purchase',
    title: '+ Registrar Compra',
    section: 'Accesos Rápidos',
    path: '/purchases/new',
    description: 'Registrar factura de compra de materiales e insumos a proveedores',
    icon: <PlusCircle className="w-4 h-4 text-[#22B2B8]" />,
    keywords: ['nueva compra', 'comprar', 'insumo', 'proveedor', 'factura', 'material', 'gasto'],
    permissions: ['purchases:read'],
    isQuickAction: true,
  },
  {
    id: 'quick-new-recipe',
    title: '+ Nueva Receta (BOM)',
    section: 'Accesos Rápidos',
    path: '/catalog/recipes/new',
    description: 'Diseñar y costear una nueva receta o ficha técnica de arreglo',
    icon: <Sparkles className="w-4 h-4 text-[#8B5CF6]" />,
    keywords: ['nueva receta', 'bom', 'ficha tecnica', 'costeo', 'arreglo', 'diseño', 'formula'],
    permissions: ['recipes:read'],
    isQuickAction: true,
  },
  {
    id: 'quick-new-product',
    title: '+ Nuevo Producto',
    section: 'Accesos Rápidos',
    path: '/catalog/products/new',
    description: 'Crear un nuevo producto terminado, insumo base o servicio',
    icon: <PlusCircle className="w-4 h-4 text-[#F59E0B]" />,
    keywords: ['nuevo producto', 'articulo', 'insumo', 'materia prima', 'crear'],
    permissions: ['products:read'],
    isQuickAction: true,
  },
  {
    id: 'quick-new-stock-tx',
    title: '+ Ajuste de Inventario',
    section: 'Accesos Rápidos',
    path: '/inventory/transactions/new',
    description: 'Registrar entrada, salida física, merma o ajuste de almacén',
    icon: <Boxes className="w-4 h-4 text-[#10B981]" />,
    keywords: ['ajuste', 'inventario', 'merma', 'salida', 'entrada', 'stock', 'almacen'],
    isQuickAction: true,
  },

  // Menús Principales - General
  {
    id: 'nav-dashboard',
    title: 'Dashboard de Control',
    section: 'General',
    path: '/',
    description: 'Panel de inicio con estadísticas de ventas, métricas y actividad en tiempo real',
    icon: <Home className="w-4 h-4 text-[#22B2B8]" />,
    keywords: ['inicio', 'dashboard', 'metricas', 'resumen', 'kpis', 'estadisticas', 'panel'],
  },
  {
    id: 'nav-profile',
    title: 'Mi Perfil de Usuario',
    section: 'General',
    path: '/profile',
    description: 'Gestionar información personal, foto de perfil y cambio de contraseña',
    icon: <UserIcon className="w-4 h-4 text-[#8B5CF6]" />,
    keywords: ['perfil', 'usuario', 'cuenta', 'contraseña', 'password', 'avatar'],
  },
  {
    id: 'nav-company',
    title: 'Configuración de Empresa',
    section: 'General',
    path: '/company',
    description: 'Datos fiscales, RIF, monedas, tasa de cambio y ajustes del negocio',
    icon: <Building2 className="w-4 h-4 text-[#F97316]" />,
    keywords: ['empresa', 'negocio', 'rif', 'moneda', 'dolar', 'bolivar', 'tasa', 'configuracion'],
    permissions: ['company:manage'],
    roles: ['ADMIN_ROLE', 'ADMIN'],
  },

  // Catálogo & Recetas
  {
    id: 'nav-products',
    title: 'Catálogo de Productos',
    section: 'Catálogo',
    path: '/catalog/products',
    description: 'Listado completo de productos terminados, insumos y materias primas',
    icon: <Layers className="w-4 h-4 text-[#F59E0B]" />,
    keywords: ['productos', 'catalogo', 'materiales', 'insumos', 'precios', 'stock'],
    permissions: ['products:read'],
  },
  {
    id: 'nav-recipes',
    title: 'Fichas Técnicas y Recetas (BOM)',
    section: 'Catálogo',
    path: '/catalog/recipes',
    description: 'Estructura de materiales de arreglos, costos automáticos y precios sugeridos',
    icon: <Sparkles className="w-4 h-4 text-[#8B5CF6]" />,
    keywords: ['recetas', 'bom', 'fichas tecnicas', 'costeo', 'arreglos', 'formula', 'materiales'],
    permissions: ['recipes:read'],
  },
  {
    id: 'nav-categories',
    title: 'Categorías de Productos',
    section: 'Catálogo',
    path: '/catalog/categories',
    description: 'Clasificación de productos por categorías y familias comerciales',
    icon: <Tag className="w-4 h-4 text-[#22B2B8]" />,
    keywords: ['categorias', 'familias', 'clasificacion', 'secciones'],
    permissions: ['categories:read'],
  },
  {
    id: 'nav-uofm',
    title: 'Unidades de Medida',
    section: 'Catálogo',
    path: '/catalog/units-of-measure',
    description: 'Unidades para control de inventario y formulación (Unidad, Metro, Kg, Caja)',
    icon: <Scale className="w-4 h-4 text-[#10B981]" />,
    keywords: ['unidades', 'medida', 'uofm', 'kilos', 'gramos', 'metros', 'piezas'],
    permissions: ['uofm:read'],
  },

  // Compras
  {
    id: 'nav-purchases',
    title: 'Compras a Proveedores',
    section: 'Compras',
    path: '/purchases',
    description: 'Registro de compras de materiales, facturas de compras y recepción de insumos',
    icon: <ShoppingCart className="w-4 h-4 text-[#22B2B8]" />,
    keywords: ['compras', 'proveedores', 'facturas compras', 'gastos', 'adquisicion'],
    permissions: ['purchases:read'],
  },

  // Ventas & Cobros
  {
    id: 'nav-sales',
    title: 'Listado de Ventas',
    section: 'Ventas & Cobros',
    path: '/sales',
    description: 'Ventas en mostrador, pedidos, cotizaciones y facturas emitidas',
    icon: <ShoppingBag className="w-4 h-4 text-[#F43F5E]" />,
    keywords: ['ventas', 'pedidos', 'cotizaciones', 'facturas', 'mostrador', 'clientes'],
    permissions: ['sales:read'],
  },
  {
    id: 'nav-payments',
    title: 'Gestión de Cobros',
    section: 'Ventas & Cobros',
    path: '/sales/payments',
    description: 'Procesamiento de pagos (Pago Móvil, Zelle, Efectivo, Punto) y recibos',
    icon: <CreditCard className="w-4 h-4 text-[#F43F5E]" />,
    keywords: ['cobros', 'pagos', 'pago movil', 'zelle', 'efectivo', 'punto de venta', 'recibos'],
    permissions: ['sales:read'],
  },

  // Inventario & Almacenes
  {
    id: 'nav-inventory-stocks',
    title: 'Existencias y Saldos de Stock',
    section: 'Inventario',
    path: '/inventory/stocks',
    description: 'Existencias físicas disponibles por almacén, lotes y niveles de stock mínimo',
    icon: <Boxes className="w-4 h-4 text-[#F59E0B]" />,
    keywords: ['existencias', 'saldos', 'stock', 'inventario', 'disponible', 'almacen'],
  },
  {
    id: 'nav-inventory-transactions',
    title: 'Movimientos de Inventario',
    section: 'Inventario',
    path: '/inventory/transactions',
    description: 'Historial de entradas, salidas, traslados entre almacenes y ajustes físicos',
    icon: <ClipboardList className="w-4 h-4 text-[#10B981]" />,
    keywords: ['movimientos', 'transacciones', 'entradas', 'salidas', 'traslados', 'ajustes'],
  },
  {
    id: 'nav-inventory-warehouses',
    title: 'Almacenes y Bodegas',
    section: 'Inventario',
    path: '/inventory/warehouses',
    description: 'Gestión de almacenes físicos, depósitos y puntos de almacenamiento',
    icon: <Truck className="w-4 h-4 text-[#F97316]" />,
    keywords: ['almacenes', 'bodegas', 'depositos', 'ubicaciones'],
  },
  {
    id: 'nav-inventory-reasons',
    title: 'Motivos de Ajuste',
    section: 'Inventario',
    path: '/inventory/reasons',
    description: 'Catálogo de motivos para movimientos de inventario y justificación de mermas',
    icon: <FileText className="w-4 h-4 text-[#64748B]" />,
    keywords: ['motivos', 'razones', 'causas', 'justificacion'],
  },
  {
    id: 'nav-inventory-ledger',
    title: 'Libro Kárdex Valorizado',
    section: 'Inventario',
    path: '/inventory/ledger',
    description: 'Registro cronológico y contable de entradas y salidas con costo promedio ponderado',
    icon: <FileText className="w-4 h-4 text-[#8B5CF6]" />,
    keywords: ['kardex', 'libro mayor', 'valorizado', 'costo promedio', 'auditoria stock'],
  },
  {
    id: 'nav-inventory-adjustments',
    title: 'Reporte de Mermas y Pérdidas',
    section: 'Inventario',
    path: '/inventory/adjustments-report',
    description: 'Análisis financiero y estadístico de mermas, pérdidas y desechos de materiales',
    icon: <ClipboardList className="w-4 h-4 text-[#EF4444]" />,
    keywords: ['mermas', 'perdidas', 'desecho', 'ajustes reporte', 'dañados'],
  },

  // Seguridad & IAM
  {
    id: 'nav-users',
    title: 'Gestión de Usuarios',
    section: 'Seguridad & IAM',
    path: '/users',
    description: 'Creación de cuentas de colaboradores, activación y asignación de roles',
    icon: <Users className="w-4 h-4 text-[#8B5CF6]" />,
    keywords: ['usuarios', 'cuentas', 'colaboradores', 'personal', 'empleados'],
    permissions: ['users:manage'],
    roles: ['ADMIN_ROLE', 'ADMIN'],
  },
  {
    id: 'nav-roles',
    title: 'Roles de Sistema',
    section: 'Seguridad & IAM',
    path: '/roles',
    description: 'Configuración de roles de usuarios y perfiles de seguridad',
    icon: <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />,
    keywords: ['roles', 'cargos', 'seguridad', 'niveles'],
    permissions: ['roles:manage'],
    roles: ['ADMIN_ROLE', 'ADMIN'],
  },
  {
    id: 'nav-permissions',
    title: 'Matriz de Permisos',
    section: 'Seguridad & IAM',
    path: '/permissions',
    description: 'Asignación detallada de permisos granulares por módulo y acción',
    icon: <KeyRound className="w-4 h-4 text-[#22B2B8]" />,
    keywords: ['permisos', 'matriz', 'privilegios', 'accesos'],
    permissions: ['roles:manage'],
    roles: ['ADMIN_ROLE', 'ADMIN'],
  },
  {
    id: 'nav-audit',
    title: 'Auditoría del Sistema',
    section: 'Seguridad & IAM',
    path: '/audit',
    description: 'Registro de trazabilidad y operaciones realizadas en la base de datos',
    icon: <FileText className="w-4 h-4 text-[#F43F5E]" />,
    keywords: ['auditoria', 'logs', 'trazas', 'seguridad', 'registro operaciones'],
    permissions: ['audit:read', 'audit:manage'],
    roles: ['ADMIN_ROLE', 'ADMIN'],
  },
];

export function usePermittedNavItems() {
  const user = useAuthStore((state) => state.user);

  const permittedItems = useMemo(() => {
    return ALL_SYSTEM_NAV_ITEMS.filter((item) =>
      checkUserAccess(user, item.permissions, item.roles)
    );
  }, [user]);

  const quickActions = useMemo(() => {
    return permittedItems.filter((item) => item.isQuickAction);
  }, [permittedItems]);

  const regularMenus = useMemo(() => {
    return permittedItems.filter((item) => !item.isQuickAction);
  }, [permittedItems]);

  const userRoleBadge = useMemo(() => {
    const roles = user?.roles || [];
    if (roles.includes('ADMIN_ROLE') || roles.includes('ADMIN')) {
      return { label: 'Administrador Total', isPrivileged: true };
    }
    const firstRole = roles[0]?.replace('_ROLE', '') || 'Operador';
    return { label: firstRole, isPrivileged: false };
  }, [user]);

  return {
    permittedItems,
    quickActions,
    regularMenus,
    userRoleBadge,
    user,
  };
}
