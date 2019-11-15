import { promisify } from 'util'
import bcrypt from "bcryptjs";
import {
  Arg,
  Mutation,
  Resolver,
} from "type-graphql";
import { v4 } from "uuid";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../../entity/User";
import { sendEmail } from '../../utils/sendEmail'
import { createBaseResolver } from "../../shared/createBaseResolver";
import {
  CreateUserInput,
  UpdateUserInput
} from "./Inputs";
import defaults from "../../config/defaults";

const BaseResolver = createBaseResolver(
  "User",
  User,
  CreateUserInput,
  UpdateUserInput,
  User
);

@Resolver(User)
export class UserResolver extends BaseResolver {
  
  @Mutation(() => User, { name: `createUser` })
  async createUser(@Arg("data", () => CreateUserInput) data: CreateUserInput) {
   let user = await User.findOne({
      where: {
        email: data.email,
      }
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(data.password, 12);
      user = await super.create({
        ...data,
        password: hashedPassword,
      });
    }
    await sendEmail({ to: data.email, content: 'Test Sign Up Mailer', subject: "Mail Register" });
    return user;
  }

  @Mutation(() => String!)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
  ): Promise<String | Error> {
    const { CONSTANTS: { USER_PASSWORD_INVALID, USER_NOT_FOUND }  } = defaults;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return new Error(USER_NOT_FOUND);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return new Error(USER_PASSWORD_INVALID);
    }

    const userData: User = JSON.parse(JSON.stringify(user));
    delete userData.password;
    console.log(defaults.JWT_SECRET)

    try {
      const token: any = await promisify(jsonwebtoken.sign)(userData, defaults.JWT_SECRET);
      return token;
    } catch (e) {
      return new Error(e.message);
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();
    await sendEmail({  to: user.email, content: token, subject: "Password Recovery" });
    return true;
  }
}
