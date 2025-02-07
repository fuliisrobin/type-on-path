export type TypeOnPath<ObjectType, Path extends string> = Path extends ""
  ? ObjectType
  : ObjectType extends null | undefined
  ? ObjectType
  : Path extends keyof ObjectType
  ? ObjectType[Path]
  : Path extends `${infer Left}.${infer Right}`
  ? Left extends keyof ObjectType
    ? TypeOnPath<ObjectType[Left], Right>
    : Left extends ""
    ? TypeOnPath<ObjectType, Right>
    : TypeOnPath<TypeOnPath<ObjectType, Left>, Right>
  : Path extends `${infer Left}[${infer key}]${infer Right}`
  ? Left extends keyof ObjectType
    ? TypeOnPath<ObjectType[Left], `[${key}]${Right}`>
    : Left extends ""
    ? ObjectType extends Array<infer U>
      ? TypeOnPath<U, Right>
      : key extends keyof ObjectType
      ? TypeOnPath<ObjectType[key], Right>
      : unknown
    : unknown
  : never;
