import { Field, InputType } from "type-graphql";

@InputType()
class BaseInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  phone: string;

  @Field(() => Boolean, { defaultValue: false })
  approved?: boolean;

  @Field()
  roleID: string;

  @Field({ nullable: true })
  areaID?: string;

  @Field({ nullable: true })
  departmentID?: string;

  @Field({ nullable: true })
  resetDate?: string;

  @Field({ nullable: true, defaultValue: "0" })
  annualLimit?: string;
}

@InputType()
export class CreateUserInput extends BaseInput {}

@InputType()
export class UpdateUserInput extends BaseInput {}
