import { Field, InputType } from 'type-graphql';
import { MinLength } from 'class-validator';

@InputType()
class BaseInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  @MinLength(5)
  password: string;
}

@InputType()
export class CreateUserInput extends BaseInput {}

@InputType()
export class UpdateUserInput extends BaseInput {}

@InputType()
export class FilterUserInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  email?: string;
}
