import { mapToDomain } from './user.mapper';
import { User } from '@auth/domain/entities/User.entity';

describe('UserMapper → mapToDomain', () => {
  const baseRecord = {
    id: 'user-1',
    email: 'user@test.com',
    password: 'hashed-password',
    name: 'Alejandro',
  };

  it('debe mapear correctamente un usuario con nombre', () => {
    const user = mapToDomain(baseRecord);

    expect(user).toBeInstanceOf(User);
    expect(user.getId()).toBe('user-1');
    expect(user.getEmail()).toBe('user@test.com');
    expect(user.getName()).toBe('Alejandro');
    expect(user.getPassword()).toBe('hashed-password');
  });

  it('debe asignar string vacío cuando el nombre es null', () => {
    const user = mapToDomain({
      ...baseRecord,
      name: null,
    });

    expect(user.getName()).toBe('');
  });
});
