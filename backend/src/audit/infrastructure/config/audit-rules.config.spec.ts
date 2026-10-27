import {
  matchAuditRule,
  resolveDefaultMethodAction,
} from './audit-rules.config';

describe('AuditRules Registry & Matcher', () => {
  it('should match authentication endpoints', () => {
    const login = matchAuditRule(
      { body: { email: 'admin@example.com' } },
      'POST',
      '/auth/login',
    );
    expect(login.model).toBe('Autenticación');
    expect(login.action).toBe('LOGIN');
    expect(login.description).toContain('admin@example.com');

    const register = matchAuditRule(
      { body: { email: 'new@example.com' } },
      'POST',
      '/auth/register',
    );
    expect(register.model).toBe('Autenticación');
    expect(register.action).toBe('REGISTER');
  });

  it('should match user endpoints with entityId and dynamic descriptions', () => {
    const createUser = matchAuditRule(
      { body: { email: 'test@example.com' } },
      'POST',
      '/users',
    );
    expect(createUser.model).toBe('Usuario');
    expect(createUser.action).toBe('CREATE');
    expect(createUser.description).toContain('test@example.com');
    expect(createUser.entityConfig?.target).toBeDefined();

    const updateUser = matchAuditRule(
      { params: { id: 'uuid-123' } },
      'PUT',
      '/users/uuid-123',
    );
    expect(updateUser.model).toBe('Usuario');
    expect(updateUser.action).toBe('UPDATE');
    expect(updateUser.entityId).toBe('uuid-123');
  });

  it('should match company endpoints with singleton entity config', () => {
    const updateCompany = matchAuditRule({}, 'PUT', '/company');
    expect(updateCompany.model).toBe('Empresa');
    expect(updateCompany.action).toBe('UPDATE');
    expect(updateCompany.entityConfig?.isSingleton).toBe(true);

    const uploadLogo = matchAuditRule({}, 'POST', '/company/logo');
    expect(uploadLogo.model).toBe('Empresa');
    expect(uploadLogo.action).toBe('UPLOAD_LOGO');
  });

  it('should match profile avatar and password endpoints', () => {
    const changePass = matchAuditRule(
      { user: { userId: 'usr-999' } },
      'PUT',
      '/profile/password',
    );
    expect(changePass.model).toBe('Perfil');
    expect(changePass.action).toBe('CHANGE_PASSWORD');
    expect(changePass.entityId).toBe('usr-999');

    const deleteAvatar = matchAuditRule(
      { user: { userId: 'usr-999' } },
      'DELETE',
      '/profile/avatar',
    );
    expect(deleteAvatar.model).toBe('Perfil');
    expect(deleteAvatar.action).toBe('DELETE_AVATAR');
  });

  it('should fallback cleanly for generic unknown REST routes', () => {
    const custom = matchAuditRule(
      { params: { id: 'prod-456' } },
      'PUT',
      '/products/prod-456',
    );
    expect(custom.model).toBe('Products');
    expect(custom.action).toBe('UPDATE');
    expect(custom.entityId).toBe('prod-456');
  });

  describe('resolveDefaultMethodAction', () => {
    it('should map HTTP methods to canonical actions', () => {
      expect(resolveDefaultMethodAction('POST')).toBe('CREATE');
      expect(resolveDefaultMethodAction('PUT')).toBe('UPDATE');
      expect(resolveDefaultMethodAction('PATCH')).toBe('UPDATE');
      expect(resolveDefaultMethodAction('DELETE')).toBe('DELETE');
      expect(resolveDefaultMethodAction('GET')).toBe('READ');
    });
  });
});
