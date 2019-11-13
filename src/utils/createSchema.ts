import { buildSchema } from 'type-graphql';

const createSchema = () => buildSchema({
  resolvers: [`${__dirname}/../content/**/*.resolver.{ts,js}`],
  authChecker: ({ context: { req } }) => !!req.session.userId,
});

export default createSchema;
