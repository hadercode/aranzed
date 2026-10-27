export interface AuditEntityConfig {
  /**
   * TypeORM Entity class for snapshotting
   */
  target: any;

  /**
   * Relations to load in findOne
   */
  relations?: Record<string, boolean>;

  /**
   * Custom ID resolver from request
   */
  resolveId?: (req: any) => string | null;

  /**
   * If true, entity is a single row without requiring ID parameter (e.g. Company)
   */
  isSingleton?: boolean;
}

export interface AuditRule {
  /**
   * Path substring or regex to match
   */
  path: string | RegExp;

  /**
   * Exact HTTP method or array of methods ('POST', 'PUT', etc.). If omitted, matches any method.
   */
  method?: string | string[];

  /**
   * Name of the module / domain model (e.g. 'Usuario', 'Empresa', 'Rol', 'Perfil', 'Autenticación', 'Ventas', 'Compras')
   */
  model: string;

  /**
   * Static action or dynamic resolver function
   */
  action?: string | ((req: any, method: string) => string);

  /**
   * Static description or dynamic resolver function
   */
  description?:
    string | ((req: any, method: string, entityId: string | null) => string);

  /**
   * Target entity configuration to capture previousState and newState
   */
  entity?: AuditEntityConfig;
}

export interface ResolvedAuditInfo {
  model: string;
  action: string;
  description: string;
  entityId: string | null;
  entityConfig?: AuditEntityConfig;
}
