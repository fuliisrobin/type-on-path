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
  : Path extends `${infer Left}[${infer Key}]${infer Right}`
  ? Left extends keyof ObjectType
    ? TypeOnPath<ObjectType[Left], `[${Key}]${Right}`>
    : Left extends ""
    ? ObjectType extends Array<infer U>
      ? TypeOnPath<U, Right>
      : Key extends keyof ObjectType
      ? TypeOnPath<ObjectType[Key], Right>
      : unknown
    : unknown
  : never;
