import { AuditRule, ResolvedAuditInfo } from './audit-rule.types';
import { authAuditRules } from './rules/auth.rules';
import { iamAuditRules } from './rules/iam.rules';
import { companyAuditRules } from './rules/company.rules';
import { catalogAuditRules } from './rules/catalog.rules';
import { salesAuditRules } from './rules/sales.rules';

export * from './audit-rule.types';
export * from './rules/auth.rules';
export * from './rules/iam.rules';
export * from './rules/company.rules';
export * from './rules/catalog.rules';
export * from './rules/sales.rules';

/**
 * Aggregated registry of audit rules from all domain modules.
 * To register rules for a new module (e.g. Sales, Purchases, Inventory):
 * 1. Create a new file in ./rules/<module>.rules.ts
 * 2. Import and spread it into AUDIT_RULES below.
 */
export const AUDIT_RULES: AuditRule[] = [
  ...authAuditRules,
  ...iamAuditRules,
  ...companyAuditRules,
  ...catalogAuditRules,
  ...salesAuditRules,
];

/**
 * Standard HTTP verb action mapper
 */
export function resolveDefaultMethodAction(method: string): string {
  switch (method.toUpperCase()) {
    case 'POST':
      return 'CREATE';
    case 'PUT':
    case 'PATCH':
      return 'UPDATE';
    case 'DELETE':
      return 'DELETE';
    case 'GET':
      return 'READ';
    default:
      return method.toUpperCase();
  }
}

/**
 * Finds matching rule or generates a fallback rule for any generic/future REST endpoints
 */
export function matchAuditRule(
  req: any,
  method: string,
  url: string,
): ResolvedAuditInfo {
  const cleanUrl = url.split('?')[0];

  // Specific match: prioritize exact/longer prefix matches first
  const rule = AUDIT_RULES.find((r) => {
    // Check method condition if specified
    if (r.method) {
      if (Array.isArray(r.method)) {
        if (!r.method.includes(method)) return false;
      } else if (r.method !== method) {
        return false;
      }
    }

    // Check path condition
    if (typeof r.path === 'string') {
      return cleanUrl.startsWith(r.path) || cleanUrl.includes(r.path);
    } else if (r.path instanceof RegExp) {
      return r.path.test(cleanUrl);
    }
    return false;
  });

  const entityId =
    rule?.entity?.resolveId?.(req) ??
    req.params?.id ??
    (cleanUrl.match(/\/([0-9a-fA-F-]{36})/)?.[1] || null);

  if (rule) {
    const action =
      typeof rule.action === 'function'
        ? rule.action(req, method)
        : rule.action || resolveDefaultMethodAction(method);

    const description =
      typeof rule.description === 'function'
        ? rule.description(req, method, entityId)
        : rule.description || `${action} en ${rule.model}`;

    return {
      model: rule.model,
      action,
      description,
      entityId,
      entityConfig: rule.entity,
    };
  }

  // Generic fallback for any newly added endpoint without explicit config
  const segments = cleanUrl.replace(/^\//, '').split('/');
  const rawModel = segments[0] || 'Sistema';
  const model = rawModel.charAt(0).toUpperCase() + rawModel.slice(1);
  const action = resolveDefaultMethodAction(method);
  const description = `${action} en ${model} (${cleanUrl})`;

  return {
    model,
    action,
    description,
    entityId,
  };
}
