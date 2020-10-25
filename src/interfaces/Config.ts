import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Configuration {
  @Field({ nullable: true })
  APP_NAME: string;

  @Field({ nullable: true })
  APP_VERSION: string;
}
