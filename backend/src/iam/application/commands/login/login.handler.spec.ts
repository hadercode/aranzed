import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LoginHandler } from './login.handler';
import { LoginCommand } from './login.command';
import { User } from '../../../domain/entities/user.entity';

describe('LoginHandler', () => {
  let loginHandler: LoginHandler;

  // Mock implementations
  let mockUserRepository: any;
  let mockHashingService: any;
  let mockJwtService: any;

  beforeEach(async () => {
    // Reset mocks before each test to ensure independent tests
    mockUserRepository = {
      findByEmail: jest.fn(),
    };

    mockHashingService = {
      compare: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginHandler,
        { provide: 'IUserRepository', useValue: mockUserRepository },
        { provide: 'IHashingService', useValue: mockHashingService },
        { provide: 'IJwtService', useValue: mockJwtService },
      ],
    }).compile();

    loginHandler = module.get<LoginHandler>(LoginHandler);
  });

  describe('execute', () => {
    it('should return a valid access token when provided with correct credentials', async () => {
      // Arrange: Setup the specific behavior for this scenario
      const command = new LoginCommand('test@example.com', 'password123');
      const mockUser = new User(
        'uuid-123',
        'test@example.com',
        'hashedpassword',
      );
      // Mock the domain entity method directly
      jest.spyOn(mockUser, 'getAllPermissions').mockReturnValue(['users:read']);

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockHashingService.compare.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      // Act: Perform the action being tested
      const result = await loginHandler.execute(command);

      // Assert: Verify the behavior, not just the implementation
      expect(result).toHaveProperty('token', 'mock.jwt.token');
      expect(result).toHaveProperty('user.email', 'test@example.com');
    });

    it('should throw an UnauthorizedException when the email does not exist', async () => {
      // Arrange
      const command = new LoginCommand('notfound@example.com', 'password123');
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(loginHandler.execute(command)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(loginHandler.execute(command)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw an UnauthorizedException when the password does not match', async () => {
      // Arrange
      const command = new LoginCommand('test@example.com', 'wrongpassword');
      const mockUser = new User(
        'uuid-123',
        'test@example.com',
        'hashedpassword',
      );

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockHashingService.compare.mockResolvedValue(false); // Wrong password simulation

      // Act & Assert
      await expect(loginHandler.execute(command)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(loginHandler.execute(command)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
