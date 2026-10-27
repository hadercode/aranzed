import { AuditService } from './audit.service';
import type { IAuditRepository } from '../../domain/repositories/audit-log.repository.interface';

describe('AuditService', () => {
  let service: AuditService;
  let mockRepository: jest.Mocked<IAuditRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn((dto) => dto as any),
      save: jest.fn(async (entity: any) =>
        Object.assign({ id: 'mock-uuid' }, entity),
      ),
      findAll: jest.fn().mockResolvedValue([[], 0]),
      findById: jest.fn(),
      getStats: jest.fn().mockResolvedValue({
        total: 10,
        todayCount: 2,
        creates: 3,
        updates: 5,
        deletes: 2,
        failed: 0,
      }),
    };

    service = new AuditService(mockRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sanitizeData', () => {
    it('should mask sensitive keys such as passwords, tokens, and secrets', () => {
      const input = {
        email: 'user@example.com',
        password: 'superSecretPassword',
        passwordHash: '$2b$10$xyz',
        nested: {
          smtpPassword: 'email-pass-123',
          normalField: 'hello',
        },
      };

      const sanitized = service.sanitizeData(input);

      expect(sanitized.email).toBe('user@example.com');
      expect(sanitized.password).toBe('[PROTEGIDO]');
      expect(sanitized.passwordHash).toBe('[PROTEGIDO]');
      expect(sanitized.nested.smtpPassword).toBe('[PROTEGIDO]');
      expect(sanitized.nested.normalField).toBe('hello');
    });
  });

  describe('calculateDiff', () => {
    it('should compute differences between previous and next states', () => {
      const prev = {
        name: 'Nexus Corp',
        phone: '12345',
        currency: 'USD',
      };
      const next = {
        name: 'Nexus Global Corp',
        phone: '12345',
        currency: 'EUR',
      };

      const diff = service.calculateDiff(prev, next);

      expect(diff).toEqual({
        name: { from: 'Nexus Corp', to: 'Nexus Global Corp' },
        currency: { from: 'USD', to: 'EUR' },
      });
    });

    it('should return null when there are no differences', () => {
      const prev = { name: 'Same' };
      const next = { name: 'Same' };

      const diff = service.calculateDiff(prev, next);
      expect(diff).toBeNull();
    });
  });

  describe('record', () => {
    it('should record an audit log with sanitized states and diff', async () => {
      const log = await service.record({
        userId: '11111111-1111-1111-1111-111111111111',
        userEmail: 'admin@example.com',
        action: 'UPDATE',
        model: 'Empresa',
        previousState: { legalName: 'Old Name', password: 'secret' },
        newState: { legalName: 'New Name', password: 'new-secret' },
        endpoint: '/company',
        method: 'PUT',
      });

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(log).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should query logs and return total, items and stats', async () => {
      const result = await service.findAll({ page: 1, limit: 10 });

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(mockRepository.getStats).toHaveBeenCalled();
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.stats).toBeDefined();
    });
  });
});
