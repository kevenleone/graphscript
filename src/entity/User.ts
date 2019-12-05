import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, Index, ObjectID, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  fullName(): string {
    const { firstName, lastName } = this;
    return `${firstName} ${lastName}`;
  }

  @Field()
  @Column()
  @Index({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;
}
