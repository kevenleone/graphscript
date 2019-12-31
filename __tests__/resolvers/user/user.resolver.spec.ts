import { request } from 'graphql-request';
import { User } from '../../../src/entity/User';
import { createTypeormConn } from '../../../src/utils/typeORMConn';
import { defaults } from '../../../src/utils/globalMethods';

const user: any = {};

describe('Should test user resolver', () => {
  beforeAll(async () => {
    await createTypeormConn();
  });

  it('Get all users and length equal 0', async () => {
    const users = await User.find();
    expect(users.length).toBe(0);
  });

  it('Should create an user', async () => {
    const name = `user${(Math.random() * 1000).toFixed(0)}`;
    user.email = `${name}@gmail.com`;
    user.firstName = 'name';
    user.lastName = 'leone';
    user.password = 123456;
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
});
