import {
  Arg,
  ClassType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { isAuth } from '../middlewares/isAuth'

export function createBaseResolver<
  T extends ClassType,
  I extends ClassType,
  Update extends ClassType
>(
  suffix: string,
  returnType: T,
  inputType: I,
  updateType: Update,
  entity: any,
  cascate?: any
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @UseMiddleware(isAuth)
    @Query(() => [returnType], { name: `getAll${suffix}` })
    async getAll() {
      return entity.find();
    }

    @UseMiddleware(isAuth)
    @Query(() => returnType, { name: `get${suffix}` })
    async get(@Arg("id", () => String) id: string) {
      return entity.findOne(id);
    }

    @UseMiddleware(isAuth)
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      return entity.create(data).save();
    }

    @UseMiddleware(isAuth)
    @Mutation(() => returnType, { name: `updateBy${suffix}ID` })
    async updateByID(
      @Arg("data", () => updateType) data: any,
      @Arg("id") id: string
    ) {
      const entityData = await this.get(id);
      return this.update(data, entityData);
    }

    @UseMiddleware(isAuth)
    @Mutation(() => [returnType], { name: `createMulti${suffix}` })
    async createMulti(@Arg("data", () => [inputType]) data: any[]) {
      const insertedData = await data.map(
        async obj => await entity.create(obj).save()
      );
      return insertedData;
    }

    @UseMiddleware(isAuth)
    @Mutation(() => Boolean, { name: `deleteBy${suffix}ID` })
    async deleteByID(@Arg("id", () => String) id: string) {
      const data = await entity.remove(await this.get(id));
      if (cascate) {
        await cascate(id);
      }
      if (data) {
        return true;
      } else {
        return false;
      }
    }

    async update(data: any, entityData: any) {
      for (let field in data) {
        entityData[field] = data[field];
      }
      return entity.save(entityData);
    }

    async getManyByPropertyID<R>(
      propertyValue: string,
      property: string
    ): Promise<R[]> {
      return entity.find({ where: { [property]: propertyValue } });
    }

    protected async setUpRelation<RT, RE, REI>(
      { propertyValue, property }: { propertyValue: string; property: string },
      relationEntity: RE,
      relationEntityInctance: REI,
      relationProperty: string,
      realtionMethod: string
    ): Promise<RT[]> {
      const data = await (relationEntity as any).find({
        where: { [property]: propertyValue }
      });
      if (data.length <= 0) {
        return [];
      }
      const returnData: RT[] = [];
      (await Promise.all(
        data.map(async (d: any) => {
          const data = await (relationEntityInctance as any)[realtionMethod](
            d[relationProperty]
          );
          if (data) {
            returnData.push(data);
          }
        })
      )) as any;
      return returnData;
    }

    protected async assignRelationData<RT>(
      findID: string,
      relationIDs: string[],
      {
        rEntity,
        where,
        propertyName,
        basePropertyName
      }: {
        rEntity: any;
        where: Object;
        propertyName: string;
        basePropertyName: string;
      }
    ): Promise<RT> {
      const foundData = await entity.findOne(findID);
      if (!foundData) {
        throw new Error("No skill found");
      }
      const relationData = await rEntity.find({
        where
      });
      if (relationData.length > 0) {
        relationData.forEach((rd: any) => {
          if (relationIDs.includes(rd[propertyName])) {
            // remove it
            relationIDs.splice(
              relationIDs.findIndex(id => id === rd[propertyName]),
              1
            );
          }
        });
      }
      if (relationIDs.length > 0) {
        await Promise.all(
          relationIDs.map(id =>
            rEntity
              .create({ [basePropertyName]: findID, [propertyName]: id })
              .save()
          )
        );
      }
      return this.get(findID);
    }
  }

  return BaseResolver;
}
