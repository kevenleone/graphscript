import { buildSchema } from 'type-graphql';

const createSchema = (): Promise<any> =>
  buildSchema({
    authChecker: ({ context: { req } }) => !!req.context.req.headers.loggedUser,
    resolvers: [`${__dirname}/../resolvers/**/*.resolver.{ts,js}`],
  });

export default createSchema;
