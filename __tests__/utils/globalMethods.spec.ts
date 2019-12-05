import { MailerConf, normalizePagination, getGraphqlOperation, HttpError } from '../../src/utils/globalMethods';
import { Pagination } from '../../src/interfaces/Pagination';

const page: Pagination = {
  pageIndex: 1,
  pageSize: 1,
  skip: 1,
  take: 1,
};

describe('Should works', () => {
  it('Get Pagination basic', () => {
    const getPage = normalizePagination(page);
    expect(getPage).toStrictEqual({ ...page, skip: 0 });
  });

  it('Get Pagination dynamic', () => {
    page.pageIndex = 2;
    page.pageSize = 10;
    const getPage = normalizePagination(page);
    expect(getPage).toStrictEqual({ ...page, skip: 10, take: 10 });
  });

  xit('Get base mailer config', async () => {
    process.env = Object.assign(process.env, { MAIL_HOST: 'localhost', MAIL_PORT: 'value' });

    const config = await MailerConf();
    console.log(config);
  });

  it('Get Query Operation by Query', () => {
    const query = `{
      getAllUser {
        id
        firstName
        lastName
      }
    }`;
    const operation = getGraphqlOperation(query);
    expect(operation).toBe('[query getAllUser]');
  });

  it('Get Query Operation by Mutation', () => {
    const mutation = `mutation {
      createMultiUser(data: {firstName: "Keven", lastName: "Leone", email: "keven.santos.sz@gmail.com", password: "123456"}) {
        id
        firstName
      }
    }
    `;
    const operation = getGraphqlOperation(mutation);
    expect(operation).toBe('[mutation createMultiUser]');
  });

  it('Validate sendError', () => {
    const errMessage = 'An test error ocurred';
    const err = HttpError(errMessage);
    expect(err).toBeInstanceOf(Error);
  });
});
