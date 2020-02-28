import { EntityOptions } from 'typeorm';
import { gql } from 'apollo-server-express';

import { Pagination, MailConfig } from '~/interfaces';
import Constants from '~/utils/contants';
import Defaults from '~/config/defaults';
import Logger from '~/utils/logger';

export const constants = Constants;
export const defaults = Defaults;
export const logger = Logger;

/**
 * @description Return the mailer credentials
 * @returns MailConfig
 */

export function MailerCredentials(): MailConfig {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = defaults;
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
