import { MailerConf, normalizePagination } from '../../src/utils/globalMethods'
import { Pagination } from '../../src/interfaces/Pagination'

const page: Pagination = {
  pageIndex: 1,
  pageSize: 1,
  skip: 1,
  take: 1
};

describe('Should works', () => {
  it('Get Pagination basic', () => {
    const getPage = normalizePagination(page);
    expect(getPage).toStrictEqual({ ...page, skip: 0 })
  });

  it('Get Pagination dynamic', () => {
    page.pageIndex = 2;
    page.pageSize = 10;
    const getPage = normalizePagination(page);
    expect(getPage).toStrictEqual({ ...page, skip: 10, take: 10 })
  });

  it('Get base mailer config', async () => {
   process.env = Object.assign(process.env, { MAIL_HOST: 'localhost', MAIL_PORT: 'value' });

   const config = await MailerConf();
   console.log(config)
  });
})