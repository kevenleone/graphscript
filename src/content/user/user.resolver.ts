import bcrypt from "bcryptjs";
import {
  Arg,
  Mutation,
  Resolver,
} from "type-graphql";
import { v4 } from "uuid";
import { User } from "../../entity/User";
import { sendEmail } from '../../utils/sendEmail'
import { createBaseResolver } from "../../shared/createBaseResolver";
import {
  CreateUserInput,
  UpdateUserInput
} from "./Inputs";

const BaseResolver = createBaseResolver(
  "User",
  User,
  CreateUserInput,
  UpdateUserInput,
  User
);

@Resolver(User)
export class UserResolver extends BaseResolver {
  
  @Mutation(() => User, { name: `register` })
  async register(@Arg("data", () => CreateUserInput) data: CreateUserInput) {
   const userExists = await User.find({
      where: {
        email: data.email,
        departmentID: data.departmentID
      }
    });

    if (userExists && userExists.length) {
      throw new Error('User Already Exists on this department');
    }

    const passwordNotHashed = Buffer.from(data.password).toString('base64');
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await super.create({
      ...data,
      password: hashedPassword,
      passwordNotHashed,
    });
    await sendEmail(data.email, "test");
    return user;
  }

  @Mutation(() => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
  ): Promise<User | Error> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return new Error("User not found.");
    }
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return new Error("Password is incorrect");
    }
    return user;
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();
    await sendEmail(
      email,
      `${process.env.FRONTEND_URL}/user/change-password/${token}`
    );
    return true;
  }
}
