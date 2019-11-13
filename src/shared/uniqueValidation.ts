import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";

export function IsUnique(entity: any, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: "isUnique",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyName],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const data = await entity.findOne({
            where: { [relatedPropertyName]: value }
          });
          return data ? false : true;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${[relatedPropertyName]} is already exists.`;
        }
      }
    });
  };
}
