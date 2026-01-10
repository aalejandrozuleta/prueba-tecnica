import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

import { JwtSessionGuard } from './jwt-session.guard';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';
import { AuthUser } from '../types/auth-user.type';

describe('JwtSessionGuard', () => {
  let guard: JwtSessionGuard;
  let jwtService: jest.Mocked<JwtService>;
  let redis: jest.Mocked<Redis>;

  const mockPayload: AuthUser = {
    id: 'user-1',
    sessionId: 'session-1',
    email: 'user@test.com'
  };

const createContext = (cookies?: Record<string, unknown>): ExecutionContext => {
  const request: any = {
    cookies,
    user: undefined,
  };

  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
};


  beforeEach(() => {
    jwtService = {
      verify: jest.fn(),
    } as any;

    redis = {
      exists: jest.fn(),
    } as any;

    guard = new JwtSessionGuard(jwtService, redis);
  });

  it('debe lanzar unauthorized si no existe el token', async () => {
    const context = createContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      Error,
    );
  });

  it('debe lanzar unauthorized si el token es inválido', async () => {
    const context = createContext({ access_token: 'invalid-token' });

    jwtService.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      Error,
    );
  });

  it('debe lanzar sessionExpired si la sesión no existe en Redis', async () => {
    const context = createContext({ access_token: 'valid-token' });

    jwtService.verify.mockReturnValue(mockPayload);
    redis.exists.mockResolvedValue(0);

    await expect(guard.canActivate(context)).rejects.toThrow(
      Error,
    );
  });

  it('debe permitir la ejecución si el token y la sesión son válidos', async () => {
    const context = createContext({ access_token: 'valid-token' });

    jwtService.verify.mockReturnValue(mockPayload);
    redis.exists.mockResolvedValue(1);

    const result = await guard.canActivate(context);

    const request = context.switchToHttp().getRequest() as any;

    expect(result).toBe(true);
    expect(request.user).toEqual(mockPayload);
  });
});
