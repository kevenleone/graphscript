import 'reflect-metadata';

import { request } from 'graphql-request';
import { Connection } from 'typeorm';

import { User } from '../../../../src/entity/User';
import { isAuth } from '../../../../src/middlewares/isAuth';
import { UserResolver } from '../../../../src/resolvers/user/user.resolver';
import { constants, defaults } from '../../../../src/utils/globalMethods';
import Queue from '../../../../src/utils/Queue';
import { createTypeormConn } from '../../../../src/utils/typeORMConn';
import { ctx, next } from '../../../test.utils';

const {
  JOB_REGISTRATION_MAILER,
  USER_NOT_FOUND,
  USER_PASSWORD_INVALID,
} = constants;
const { createUser, forgotPassword, login } = new UserResolver();
const INVALID_EMAIL = 'invalid@email.com';
const user: any = {};

let ormConn: Connection;
let token: string | Error = '';

describe('Should test user resolver', () => {
  beforeAll(async () => {
    ormConn = await createTypeormConn();
  });

  afterAll(async (done) => {
    await ormConn.close();
    jest.restoreAllMocks();
    done();
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
        fullName: `${user.firstName} ${user.lastName}`,
        lastName: user.lastName,
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
    const spy = jest.spyOn(Queue, 'add').mockImplementation(() => ({}));
    const response = await createUser(_user);
    expect(spy).toBeCalledWith(JOB_REGISTRATION_MAILER, {
      email: _user.email,
      firstName: _user.firstName,
    });
    spy.mockRestore();
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
    token = await login(user.email, user.password);
    expect(token).toBeTruthy();
  });

  it(`Should pass through Auth Middleware`, async () => {
    ctx.context.req.headers.authorization = `Bearer ${token}`;
    isAuth(ctx, next).then((response) => expect(response).toStrictEqual({}));
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
    const spy = jest.spyOn(Queue, 'add').mockImplementation(() => ({}));
    const response = await forgotPassword(user.email);
    expect(spy).toBeCalled();
    spy.mockRestore();
    expect(response).toBeTruthy();
  });

  it('Should try forgot the password with invalid email', async () => {
    const response = await forgotPassword(INVALID_EMAIL);
    expect(response).toBeFalsy();
  });
});
