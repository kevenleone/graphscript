import { MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class UserBaseInput {
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
export class CreateUserInput extends UserBaseInput {}

@InputType()
export class UpdateUserInput extends UserBaseInput {}

@InputType()
export class FilterUserInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  email?: string;
}
