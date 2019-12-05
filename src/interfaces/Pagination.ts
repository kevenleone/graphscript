import { Field, InputType } from 'type-graphql';

export interface Pagination {
  pageIndex?: number;
  pageSize?: number;
  take?: number;
  skip?: number;
}

@InputType()
export class PaginationQL {
  @Field({ nullable: true })
  pageIndex?: number;

  @Field({ nullable: true })
  pageSize?: number;
}
