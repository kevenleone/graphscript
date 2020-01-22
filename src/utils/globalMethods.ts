/* eslint-disable @typescript-eslint/camelcase */
import { EntityOptions } from 'typeorm';
import { gql } from 'apollo-server-express';
import sendgridTransport from 'nodemailer-sendgrid-transport';

import { Pagination, MailConfig } from '~/interfaces';
import Constants from '~/utils/contants';
import Defaults from '~/config/defaults';
import Logger from '~/utils/logger';

export const constants = Constants;
export const defaults = Defaults;
export const logger = Logger;

/**
 *
 * @param message The message error to return or throw
 * @param shouldReturn Should return an error or simply throw, default = false
 */

export function sendError(message: string, shouldReturn = false): Error {
  logger.error(message);
  const Err: Error = new Error(message);
  if (!shouldReturn) {
    throw Err;
  }
  return Err;
}

/**
 * @param message The return message error, used for GraphQL return
 */

export function HttpError(message: string): Error {
  return sendError(message, true);
}

/**
 * @description Return the mailer credentials
 * @returns MailConfig
 */

export function MailerCredentials(): MailConfig {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, SENDGRID_USERNAME, SENDGRID_PASSWORD } = defaults;
  if (SENDGRID_USERNAME && SENDGRID_PASSWORD) {
    return sendgridTransport({
      auth: {
        api_user: SENDGRID_USERNAME,
        api_key: SENDGRID_PASSWORD,
      },
    });
  }
  return {
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  };
}

/**
 *
 * @param graphqlQuery GQL Request
 * @returns A string with the operation name
 */

export function getGraphqlOperation(graphqlQuery: any): string {
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

/**
 *
 * @param pagination Pagination Object
 * @param defaultSize How many items will be displayed, default = 20
 */

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

export async function execMiddleware(entity: EntityOptions, data: any, ...middlewares: Function[]): Promise<void> {
  for (const middleware of middlewares) {
    await middleware(entity, data);
  }
}
