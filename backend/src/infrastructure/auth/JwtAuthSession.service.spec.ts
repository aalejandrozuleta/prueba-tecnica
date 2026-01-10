import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { AuthSessionServiceImpl } from './JwtAuthSession.service';

describe('AuthSessionServiceImpl', () => {
  let service: AuthSessionServiceImpl;
  let jwtService: jest.Mocked<JwtService>;
  let redis: jest.Mocked<Redis>;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;

    redis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as any;

    service = new AuthSessionServiceImpl(jwtService, redis);
  });

  describe('createSession()', () => {
    it('debe crear una nueva sesión si no existe', async () => {
      redis.get.mockResolvedValue(null);
      jwtService.sign.mockReturnValue('token');

      const result = await service.createSession(
        'user-1',
        'user@test.com',
        'User',
      );

      expect(result.accessToken).toBe('token');
      expect(result.refreshToken).toBe('token');

      expect(redis.set).toHaveBeenCalled();
    });

    it('debe reutilizar una sesión existente', async () => {
      redis.get.mockResolvedValue('existing-session-id');
      jwtService.sign.mockReturnValue('token');

      const result = await service.createSession(
        'user-1',
        'user@test.com',
      );

      expect(result.accessToken).toBeDefined();
      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe('refresh()', () => {
    it('debe emitir un nuevo access token si el refresh token es válido', async () => {
      jwtService.verify.mockReturnValue({ sessionId: 'session-1' });
      redis.get.mockResolvedValue(
        JSON.stringify({
          id: 'user-1',
          email: 'user@test.com',
          name: 'User',
          sessionId: 'session-1',
        }),
      );
      jwtService.sign.mockReturnValue('new-access-token');

      const token = await service.refresh('valid-refresh-token');

      expect(token).toBe('new-access-token');
    });

    it('debe lanzar excepción si el refresh token es inválido', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('invalid');
      });

      await expect(
        service.refresh('invalid-token'),
      ).rejects.toThrow(
        Error,
      );
    });

    it('debe lanzar excepción si la sesión no existe', async () => {
      jwtService.verify.mockReturnValue({ sessionId: 'session-1' });
      redis.get.mockResolvedValue(null);

      await expect(
        service.refresh('valid-token'),
      ).rejects.toThrow(
        Error,
      );
    });
  });

  describe('revokeSession()', () => {
    it('debe eliminar la sesión y la referencia de usuario', async () => {
      redis.get.mockResolvedValue(
        JSON.stringify({ id: 'user-1' }),
      );

      await service.revokeSession('session-1');

      expect(redis.del).toHaveBeenCalledWith('user_session:user-1');
      expect(redis.del).toHaveBeenCalledWith('session:session-1');
    });

    it('debe eliminar la sesión aunque no exista referencia de usuario', async () => {
      redis.get.mockResolvedValue(null);

      await service.revokeSession('session-1');

      expect(redis.del).toHaveBeenCalledWith('session:session-1');
    });
  });
});
