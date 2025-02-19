 # TypeOnPath

The `TypeOnPath` utility is a TypeScript type that allows you to infer type from an object based on a string path. This can be particularly useful when dealing with JSON-like data structures, the data structures must be fully known at compile time, and only support literal path (paths from variables are not supported).

### Install

To install type-on-path as a development dependency, run the following command:

```sh
npm i -D type-on-path
```

## Usage

### Basic Example
```typescript
import { TypeOnPath } from 'type-on-path';

type MyObject = {
  user: {
    name: string;
    age: number;
  };
  posts: Array<{
    title: string;
    content: string;
  }>;
};

type UserName = TypeOnPath<MyObject, "user.name">; // string
type FirstPostTitle = TypeOnPath<MyObject, "posts[0].title">; // string
```

### Complex Example
```typescript
type NestedObject = {
  a: {
    b: {
      c: {
        d: number;
      };
    };
  };
};

type ValueOfD = TypeOnPath<NestedObject, "a.b.c.d">; // number
```

## Explanation

The `TypeOnPath` type is defined recursively and uses template literal types to handle different path syntaxes (`.` for nested properties and `[]` for array indexing). Here's a breakdown of how it works:

1. **Base Case**: If the path is an empty string, return the object type directly.
2. **Direct Property Access**: If the path corresponds directly to a property in the object, return that property type.
3. **Nested Paths (dot notation)**: If the path consists of multiple parts separated by dots, recursively access deeper properties.
4. **Array Indexing**: If the path includes array indexing (`[index]`), handle it similarly to dot notation but specifically for arrays.
5. **Fallback**: If none of the above conditions match, return `never`.

## Examples

### Dot Notation Example
```typescript
type User = TypeOnPath<{ user: { name: string; age: number } }, "user.name">; // string
```

### Array Indexing Example
```typescript
type FirstPost = TypeOnPath<{ posts: [{ title: string; content: string }] }, "posts[0].title">; // string
```

## Handling Arrays with Different Types

The `TypeOnPath` utility not only works for objects but also handles arrays, returning a union type of all possible values if the path leads to an array index or nested property within that array. This is particularly useful when dealing with dynamic or unknown structures where elements can be of different types.

### Example: Union Type in Arrays
```typescript
type MixedArray = Array<{ name: string } | { age: number }>;

type FirstElementNameOrAge = TypeOnPath<MixedArray, "[0].name">; // string | undefined (if first element is an object with name)
                                                    // or string | undefined (if first element is an object with age)
```

### Example: Union Type in Nested Arrays
```typescript
type DeepNestedArray = Array<{ posts: Array<{ title: string; content: string }> }>;

type FirstPostTitleInDeepArray = TypeOnPath<DeepNestedArray, "[0].posts[0].title">; // string | undefined (if first nested array element has a title)
                                                                                       // or string | undefined (if it doesn't have a title)
```

### Notes on Handling Arrays
- When the path leads to an array index, `TypeOnPath` will return a union type of all possible values within that array.
- If the array element does not match any known type in its hierarchy, it returns `never`.

This behavior ensures that you can handle complex and dynamic data structures with confidence, knowing that TypeScript's type system can adapt to different types within arrays or nested properties.

### Use with lodash _.get
Using _.get is a good way of reducing the branchs for nested `?.` access to the properties, however, lodash's _.get does not provide strong typing for nested properties or arrays, and with `TypeOnPath` can automatically populate the type of the value. This is extremely useful when you already have a type for the object but need to access deeply nested properties or array elements. For example, query result from GraphQL, data type is guaranteed by the types generated from the GraphQL schema.

```typescript
import { TypeOnPath } from 'type-on-path'; 
import { get } from 'lodash';

function typedGet<T, P extends string>(obj: T, path: P): TypeOnPath<T, P> {
  return get(obj, path) as TypeOnPath<T, P>;
}
const data = { user: { name: 'John', age: 30 }, posts: [{ title: 'Post1', content: 'Content1' }] };

const userName = typedGet(data, "user.name"); //user.name value is John and is string type
const firstPostTitle = typedGet(data, "posts[0].title"); //firstPostTitle value: Post1 and is string type
```


## Path Syntax
- **Dot Notation**: `"user.name"` accesses the nested property within an object.
- **Array Indexing**: `"posts[0].title"` accesses the first element's title in an array.
- **Mixed**: `"a.b.c[0].d"` can access deeply nested properties and indexed arrays.

## Notes
- The type supports both dot notation for nested objects and array indexing.
- If the path does not match any known syntax, it returns `never`.
- **Initial version of this README is generated by DeepSeek Coder v2**, if you find any inaccuracies, please file a github issue.



