import { buildSchema } from 'type-graphql';

const createSchema = (): Promise<any> =>
  buildSchema({
    resolvers: [`${__dirname}/../resolvers/**/*.resolver.{ts,js}`],
    authChecker: ({ context: { req } }) => !!req.context.req.headers.loggedUser,
  });

export default createSchema;
