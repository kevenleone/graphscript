import 'reflect-metadata';

import { request } from 'graphql-request';
import { UserResolver } from '~/resolvers/user/user.resolver';
import { createTypeormConn } from '~/utils/typeORMConn';
import { defaults, constants } from '~/utils/globalMethods';
import { User } from '~/entity/User';

const { USER_PASSWORD_INVALID, USER_NOT_FOUND } = constants;
const { createUser, forgotPassword, login } = new UserResolver();
const INVALID_EMAIL = 'invalid@email.com';
const user: any = {};

describe('Should test user resolver', () => {
  beforeAll(async () => {
    await createTypeormConn();
  });

  it('Get all users and length equal 0', async () => {
    const users = await User.find();
    expect(users.length).toBe(0);
  });

  it('Should create an user with HTTP', async () => {
    const name = `user${(Math.random() * 1000).toFixed(0)}`;
    user.email = `${name}@gmail.com`;
    user.firstName = 'name';
    user.lastName = 'leone';
    user.password = '123456';
    const mutation = `
      mutation {
        createUser(data: {
          firstName: "${user.firstName}", 
          lastName: "${user.lastName}", 
          email: "${user.email}"
          password: "${user.password}", 
        }) {
          firstName,
          lastName,
          fullName
        }
      } 
    `;

    const response = await request(defaults.TEST_HOST, mutation);
    expect(response).toEqual({
      createUser: {
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
      },
    });
    const users = await User.find({ where: { email: user.email } });
    expect(users.length).toBe(1);
  });

  it('Should create an user with success', async () => {
    const name = `user${(Math.random() * 1000).toFixed(0)}`;
    const _user = {
      email: `${name}@gmail.com`,
      firstName: name,
      lastName: 'leone',
      password: '123456',
    };

    const response = await createUser(_user);

    expect(response).toBeTruthy();
    const users = await User.find();
    expect(users.length).toBe(2);
  });

  it('Should create an user and return the same user', async () => {
    const response = await createUser(user);
    expect(response).toBeTruthy();
    const users = await User.find();
    expect(users.length).toBe(2);
  });

  it('Should login and get token', async () => {
    const token = await login(user.email, user.password);
    expect(token).toBeTruthy();
  });

  it('Should login with invalid email', async () => {
    const token = await login(INVALID_EMAIL, user.password);
    expect(token).toStrictEqual(new Error(USER_NOT_FOUND));
  });

  it('Should login with invalid password', async () => {
    const token = await login(user.email, 'errrrrr');
    expect(token).toStrictEqual(new Error(USER_PASSWORD_INVALID));
  });

  it('Should forgot the password and add event to queue', async () => {
    const response = await forgotPassword(user.email);
    expect(response).toBeTruthy();
  });

  it('Should try forgot the password with invalid email', async () => {
    const response = await forgotPassword(INVALID_EMAIL);
    expect(response).toBeFalsy();
  });
});
