import { UpdateCompanyHandler } from './update-company.handler';
import { UpdateCompanyCommand } from './update-company.command';
import { Company } from '../../../domain/entities/company.entity';

describe('UpdateCompanyHandler', () => {
  let handler: UpdateCompanyHandler;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      get: jest.fn(),
      save: jest.fn(),
    };
    handler = new UpdateCompanyHandler(mockRepository);
  });

  it('should update company attributes and save', async () => {
    const existing = new Company({
      id: 'comp-1',
      identificationNumber: 'J-12345678',
      legalName: 'Old Name',
      currencyCode: 'USD',
    });
    mockRepository.get.mockResolvedValue(existing);
    mockRepository.save.mockImplementation(async (comp: Company) => comp);

    const command = new UpdateCompanyCommand({
      legalName: 'New Name Inc.',
      currencyCode: 'EUR',
      currencySymbol: '€',
    });

    const result = await handler.execute(command);
    expect(result.legalName).toBe('New Name Inc.');
    expect(result.currencyCode).toBe('EUR');
    expect(result.currencySymbol).toBe('€');
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
