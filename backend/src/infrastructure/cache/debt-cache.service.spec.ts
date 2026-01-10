import { DebtCacheService } from './debt-cache.service';
import { Redis } from 'ioredis';

describe('DebtCacheService', () => {
  let service: DebtCacheService;
  let redis: jest.Mocked<Redis>;

  beforeEach(() => {
    redis = {
      get: jest.fn(),
      set: jest.fn(),
      keys: jest.fn(),
      del: jest.fn(),
    } as any;

    service = new DebtCacheService(redis);
  });

  describe('get()', () => {
    it('debe retornar null si la clave no existe', async () => {
      redis.get.mockResolvedValue(null);

      const result = await service.get('debt:1');

      expect(result).toBeNull();
      expect(redis.get).toHaveBeenCalledWith('debt:1');
    });

    it('debe retornar el valor parseado si existe en caché', async () => {
      const cachedValue = { id: '1', amount: 100 };

      redis.get.mockResolvedValue(JSON.stringify(cachedValue));

      const result = await service.get<typeof cachedValue>('debt:1');

      expect(result).toEqual(cachedValue);
    });
  });

  describe('set()', () => {
    it('debe guardar el valor serializado con TTL por defecto', async () => {
      const data = { id: '1', amount: 100 };

      await service.set('debt:1', data);

      expect(redis.set).toHaveBeenCalledWith(
        'debt:1',
        JSON.stringify(data),
        'EX',
        3600,
      );
    });

    it('debe guardar el valor con TTL personalizado', async () => {
      const data = { id: '1', amount: 100 };

      await service.set('debt:1', data, 120);

      expect(redis.set).toHaveBeenCalledWith(
        'debt:1',
        JSON.stringify(data),
        'EX',
        120,
      );
    });
  });

  describe('invalidateByPattern()', () => {
    it('no debe eliminar nada si no hay claves que coincidan', async () => {
      redis.keys.mockResolvedValue([]);

      await service.invalidateByPattern('debt:*');

      expect(redis.del).not.toHaveBeenCalled();
    });

    it('debe eliminar todas las claves que coincidan con el patrón', async () => {
      const keys = ['debt:1', 'debt:2'];

      redis.keys.mockResolvedValue(keys);

      await service.invalidateByPattern('debt:*');

      expect(redis.del).toHaveBeenCalledWith(...keys);
    });
  });
});
