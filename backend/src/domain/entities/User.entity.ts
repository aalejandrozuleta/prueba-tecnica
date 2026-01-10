import { UserRole } from "../enums/UserRole.enum";
import { Email } from "../value-objects/Email.vo";
import { HashedPassword } from "../value-objects/HashedPassword.vo";
import { UserId } from "../value-objects/UserId.vo";

export class User {
  constructor(
    private readonly id: UserId,
    private name: string,
    private email: Email,
    private password: HashedPassword,
  ) { }

  getId(): string {
  return this.id.getValue();
}


  getEmail(): string {
    return this.email.getValue();
  }

  getName(): string {
    return this.name;
  }

  getPassword(): string {
    return this.password.getValue();
  }

  static create(props: {
    name: string;
    email: Email;
    password: HashedPassword;
  }): User {
    return new User(
      UserId.create(),
      props.name,
      props.email,
      props.password
    );
  }

}
