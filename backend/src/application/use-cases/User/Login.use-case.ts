import { LoginUserDto } from "@auth/application/dto/LoginUser.dto";
import { AuthSessionService } from "@auth/application/ports/AuthSessionService.port";
import { LoginAttemptRepository } from "@auth/application/ports/LoginAttemptRepository.port";
import { PasswordHasher } from "@auth/application/ports/PasswordHasher.port";
import { AUTH_SESSION_SERVICE } from "@auth/application/tokens/auth-session.token";
import { LOGIN_ATTEMPT_REPOSITORY } from "@auth/application/tokens/login-attempt.token";
import { PASSWORD_HASHER } from "@auth/application/tokens/password-hasher.token";
import { USER_REPOSITORY } from "@auth/application/tokens/user-repository.token";
import { ExceptionFactory } from "@auth/domain/exceptions/ExceptionFactory";
import { UserRepository } from "@auth/domain/repositories/User.repository";
import { Email } from "@auth/domain/value-objects/Email.vo";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class LoginUserUseCase {

  constructor(
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(LOGIN_ATTEMPT_REPOSITORY)
    private readonly loginAttempts: LoginAttemptRepository,

    @Inject(AUTH_SESSION_SERVICE)
    private readonly authSessionService: AuthSessionService,
  ) { }

  async execute(dto: LoginUserDto, ip: string): Promise<{ accessToken: string; refreshToken: string }> {  
    if (await this.loginAttempts.isBlocked(dto.email, ip)) {
      throw ExceptionFactory.accountBlocked(900);
    }
    
    const email = new Email(dto.email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      await this.loginAttempts.increment(dto.email, ip);
      throw ExceptionFactory.invalidCredentials();
    }
  
    const valid = await this.passwordHasher.compare(dto.password, user.getPassword());
    
    if (!valid) {
      const attempts = await this.loginAttempts.increment(dto.email, ip);
      if (attempts >= 3) {
        await this.loginAttempts.block(dto.email, ip, 900);
      }
      throw ExceptionFactory.invalidCredentials();
    }

    await this.loginAttempts.reset(email.getValue(), ip);

    return this.authSessionService.createSession(
      user.getId(),
      user.getEmail(),
      user.getName(),
    );
  }
}