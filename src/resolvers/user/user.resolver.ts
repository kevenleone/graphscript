import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { promisify } from 'util';
import { v4 } from 'uuid';

import { User } from '../../entity/User';
import { createBaseResolver } from '../../utils/createBaseResolver';
import { constants, defaults, logger } from '../../utils/globalMethods';
import Queue from '../../utils/Queue';
import { CreateUserInput, FilterUserInput, UpdateUserInput } from './Inputs';

const { JOB_RECOVERY_MAILER, JOB_REGISTRATION_MAILER } = constants;

const Inputs = {
  create: CreateUserInput,
  filter: FilterUserInput,
  update: UpdateUserInput,
};

const BaseResolver = createBaseResolver('User', User, User, Inputs);

@Resolver(User)
export class UserResolver extends BaseResolver {
  @Mutation(() => User, { name: `createUser` })
  async createUser(
    @Arg('data', () => CreateUserInput) data: CreateUserInput,
  ): Promise<User | undefined> {
    const { email, firstName } = data;
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
      Queue.add(JOB_REGISTRATION_MAILER, { email, firstName });
    }
    return user;
  }

  @Mutation(() => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<string | Error> {
    const {
      CONSTANTS: { USER_NOT_FOUND, USER_PASSWORD_INVALID },
      JWT_SECRET,
    } = defaults;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return new Error(USER_NOT_FOUND);
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return new Error(USER_PASSWORD_INVALID);
    }

    const userData = { ...user, password: '' };

    try {
      const token: any = await promisify(jsonwebtoken.sign)(
        userData,
        JWT_SECRET,
      );
      logger.info(`Token generated for ${email}`);
      return token;
    } catch (e) {
      return new Error(e.message);
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return false;
    }
    Queue.add(JOB_RECOVERY_MAILER, {
      email,
      firstName: user.firstName,
      token: v4(),
    });
    return true;
  }
}
