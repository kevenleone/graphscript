import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';
import jsonwebtoken from 'jsonwebtoken';
import { Arg, Mutation, Resolver } from 'type-graphql';

import { CreateUserInput, UpdateUserInput, FilterUserInput } from './Inputs';
import { HttpError, defaults, logger, constants } from '~/utils/globalMethods';
import { createBaseResolver } from '~/utils/createBaseResolver';
import { User } from '~/entity/User';
import Queue from '~/utils/Queue';

const { JOB_RECOVERY_MAILER, JOB_REGISTRATION_MAILER } = constants;

const BaseResolver = createBaseResolver(
  'User',
  User,
  { create: CreateUserInput, update: UpdateUserInput, filter: FilterUserInput },
  User
);

@Resolver(User)
export class UserResolver extends BaseResolver {
  @Mutation(() => User, { name: `createUser` })
  async createUser(@Arg('data', () => CreateUserInput) data: CreateUserInput): Promise<User | undefined> {
    const { email } = data;
    let user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(data.password, 12);
      user = await super.create({
        ...data,
        password: hashedPassword,
      });
      Queue.add(JOB_REGISTRATION_MAILER, { email, name: data.firstName });
    }
    return user;
  }

  @Mutation(() => String)
  async login(@Arg('email') email: string, @Arg('password') password: string): Promise<string | Error> {
    const {
      JWT_SECRET,
      CONSTANTS: { USER_PASSWORD_INVALID, USER_NOT_FOUND },
    } = defaults;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return HttpError(USER_NOT_FOUND);
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return HttpError(USER_PASSWORD_INVALID);
    }

    const userData: User = JSON.parse(JSON.stringify(user));
    delete userData.password;

    try {
      const token: any = await promisify(jsonwebtoken.sign)(userData, JWT_SECRET);
      logger.info(`Token generated for ${email}`);
      return token;
    } catch (e) {
      return HttpError(e.message);
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();
    Queue.add(JOB_RECOVERY_MAILER, { email, name: user.firstName, token });
    return true;
  }
}
