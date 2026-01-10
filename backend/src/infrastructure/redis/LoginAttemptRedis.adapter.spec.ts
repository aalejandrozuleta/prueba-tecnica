import Redis from 'ioredis';
import { LoginAttemptRedisAdapter } from './LoginAttemptRedis.adapter';

describe('LoginAttemptRedisAdapter', () => {
  let redis: jest.Mocked<Redis>;
  let adapter: LoginAttemptRedisAdapter;

  const email = 'user@test.com';
  const ip = '127.0.0.1';

  beforeEach(() => {
    redis = {
      exists: jest.fn(),
      incr: jest.fn(),
      expire: jest.fn(),
      del: jest.fn(),
      set: jest.fn(),
    } as any;

    adapter = new LoginAttemptRedisAdapter(redis);
  });

  describe('isBlocked', () => {
    it('debe retornar true si Redis indica bloqueo', async () => {
      redis.exists.mockResolvedValue(1);

      const result = await adapter.isBlocked(email, ip);

      expect(result).toBe(true);
      expect(redis.exists).toHaveBeenCalledWith(
        `login:block:${email}:${ip}`,
      );
    });

    it('debe retornar false si Redis no indica bloqueo', async () => {
      redis.exists.mockResolvedValue(0);

      const result = await adapter.isBlocked(email, ip);

      expect(result).toBe(false);
    });
  });

  describe('increment', () => {
    it('debe incrementar y setear TTL en el primer intento', async () => {
      redis.incr.mockResolvedValue(1);

      const attempts = await adapter.increment(email, ip);

      expect(attempts).toBe(1);
      expect(redis.expire).toHaveBeenCalledWith(
        `login:fail:${email}:${ip}`,
        15 * 60,
      );
    });

    it('no debe setear TTL si no es el primer intento', async () => {
      redis.incr.mockResolvedValue(2);

      const attempts = await adapter.increment(email, ip);

      expect(attempts).toBe(2);
      expect(redis.expire).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('debe eliminar el contador de intentos', async () => {
      await adapter.reset(email, ip);

      expect(redis.del).toHaveBeenCalledWith(
        `login:fail:${email}:${ip}`,
      );
    });
  });

  describe('block', () => {
    it('debe bloquear con TTL', async () => {
      await adapter.block(email, ip, 300);

      expect(redis.set).toHaveBeenCalledWith(
        `login:block:${email}:${ip}`,
        '1',
        'EX',
        300,
      );
    });
  });
});
