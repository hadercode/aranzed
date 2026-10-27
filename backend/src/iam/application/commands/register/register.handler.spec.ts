import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { RegisterHandler } from './register.handler';
import { RegisterCommand } from './register.command';
import { User } from '../../../domain/entities/user.entity';

describe('RegisterHandler', () => {
  let registerHandler: RegisterHandler;

  // Mock implementations
  let mockUserRepository: any;
  let mockHashingService: any;

  beforeEach(async () => {
    // Reset mocks before each test
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    mockHashingService = {
      hash: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterHandler,
        { provide: 'IUserRepository', useValue: mockUserRepository },
        { provide: 'IHashingService', useValue: mockHashingService },
      ],
    }).compile();

    registerHandler = module.get<RegisterHandler>(RegisterHandler);
  });

  describe('execute', () => {
    it('should successfully register a new user and save it to the repository', async () => {
      // Arrange
      const command = new RegisterCommand('newuser@example.com', 'password123');
      mockUserRepository.findByEmail.mockResolvedValue(null); // No existing user
      mockHashingService.hash.mockResolvedValue('hashedpassword');
      mockUserRepository.save.mockResolvedValue(undefined);

      // Act
      await registerHandler.execute(command);

      // Assert
      // We check that save was called with a valid User entity containing the right email and hashed password
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);

      const savedUser = mockUserRepository.save.mock.calls[0][0];
      expect(savedUser).toBeInstanceOf(User);
      expect(savedUser.email).toBe('newuser@example.com');
      expect(savedUser.passwordHash).toBe('hashedpassword');
      expect(savedUser.id).toBeDefined(); // Should have generated a UUID
    });

    it('should throw a ConflictException when the email is already in use', async () => {
      // Arrange
      const command = new RegisterCommand(
        'existing@example.com',
        'password123',
      );
      const existingUser = new User(
        'uuid-123',
        'existing@example.com',
        'oldhash',
      );
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(registerHandler.execute(command)).rejects.toThrow(
        ConflictException,
      );
      await expect(registerHandler.execute(command)).rejects.toThrow(
        'Email already in use',
      );

      // Also verify that we didn't attempt to hash the password or save the user
      expect(mockHashingService.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
