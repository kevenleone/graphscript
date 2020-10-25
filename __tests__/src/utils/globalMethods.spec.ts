import { Pagination } from '../../../src/interfaces';
import {
  getGraphqlOperation,
  normalizePagination,
} from '../../../src/utils/globalMethods';

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
});
