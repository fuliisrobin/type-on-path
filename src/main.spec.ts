import { TypeOnPath } from './main'; // Adjust the import path as necessary

// Define types used for testing
type Obj = {
  a: { b: string | number },
  arr: Array<{ c: boolean }>,
};


describe('TypeOnPath', () => {
  it('should return the type directly if the path is a direct key', () => {
    const result1: TypeOnPath<Obj, 'a'> = {} as any; // This should pass because `a` exists in Obj and its type is an object
    expect(result1).toBeInstanceOf(Object);
  });

  it('should return the correct nested type using dot notation', () => {
    const result2: TypeOnPath<Obj, 'a.b'> = ''; // This should pass because `a.b` exists in Obj and its type is string | number
    expect(typeof result2).toBe('string'); // or 'number' depending on the actual structure of `Obj`
  });

  it('should handle array indexing correctly', () => {
    const result3: TypeOnPath<Obj, 'arr[0].c'> = true; // This should pass because `arr[0].c` exists in Obj and its type is boolean
    expect(result3).toBeTruthy();
  });

  it('should handle empty path correctly', () => {
    const result4: TypeOnPath<Obj, ''> = {} as any; // The base case should return the object itself if no path is provided
    expect(result4).toEqual({});
  });

  it('Note, non-existent paths should not compile', () => {
    type result5 = TypeOnPath<Obj, 'nonExistent'>;
    // result5 = ''; This should cause a compilation error because `nonExistent` does not exist in Obj
  });


});