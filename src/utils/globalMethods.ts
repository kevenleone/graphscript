import nodemailer from 'nodemailer';
import gql from 'graphql-tag';
import Logger from './logger';
import Defaults from '../config/defaults';
import { Pagination } from '../interfaces/Pagination';

export const logger = Logger;
export const defaults = Defaults;

export function sendError(message: string, shouldReturn = false): Error {
  logger.error(message);
  const Err: Error = new Error(message);
  if (!shouldReturn) {
    throw Err;
  }
  return Err;
}

export function HttpError(message: string): Error {
  return sendError(message, true);
}

export async function MailerConf() {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, ENVIRONMENT } = defaults;
  const config = {
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  };
  if (ENVIRONMENT !== 'production') {
    const { user, pass } = await nodemailer.createTestAccount();
    config.auth.user = user;
    config.auth.pass = pass;
  }

  return config;
}

export function getGraphqlOperation(graphqlQuery: any) {
  try {
    const GQL = gql`
      ${graphqlQuery}
    `;
    const operations = GQL.definitions.map(
      (query: any) =>
        `${query.operation} ${query.name ? query.name.value : query.selectionSet.selections[0].name.value}`
    );
    return `[${operations.join(', ')}]`;
  } catch (e) {
    logger.error(`Error in getGraphqlOperation, reason: ${e.message}`);
    return 'Unknown';
  }
}

export function normalizePagination(pagination: Pagination, defaultSize = 20): Pagination {
  const pageSize = pagination.pageSize || defaultSize;
  const pageIndex = pagination.pageIndex || 1;
  const take = pageSize;
  let skip = 0;

  if (pageIndex > 1) {
    skip = take * (pageIndex - 1);
  }

  return {
    pageSize,
    pageIndex,
    take,
    skip,
  };
}
