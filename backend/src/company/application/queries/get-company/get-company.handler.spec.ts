import { GetCompanyHandler } from './get-company.handler';
import { Company } from '../../../domain/entities/company.entity';

describe('GetCompanyHandler', () => {
  let handler: GetCompanyHandler;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      get: jest.fn(),
      save: jest.fn(),
    };
    handler = new GetCompanyHandler(mockRepository);
  });

  it('should return existing company if found', async () => {
    const existing = new Company({
      id: 'comp-1',
      identificationNumber: 'J-12345678',
      legalName: 'Test Corp',
    });
    mockRepository.get.mockResolvedValue(existing);

    const result = await handler.execute();
    expect(result).toBe(existing);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should initialize and save default company if none exists', async () => {
    mockRepository.get.mockResolvedValue(null);
    mockRepository.save.mockImplementation(async (comp: Company) => comp);

    const result = await handler.execute();
    expect(result).toBeDefined();
    expect(result.legalName).toBe('Mi Empresa');
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
