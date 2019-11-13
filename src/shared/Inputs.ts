import { InputType, Field } from "type-graphql";

@InputType()
export class SkillIDsInput {
  @Field(() => [String])
  skillIDs: string[];
}
