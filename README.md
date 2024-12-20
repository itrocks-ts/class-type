[![npm version](https://img.shields.io/npm/v/@itrocks/class-type?logo=npm)](https://www.npmjs.org/package/@itrocks/class-type)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/class-type)](https://www.npmjs.org/package/@itrocks/class-type)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/class-type?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/class-type)
[![issues](https://img.shields.io/github/issues/itrocks-ts/class-type)](https://github.com/itrocks-ts/class-type/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# class-type

Helper types and functions to identify, validate, and manipulate classes, objects, prototypes and their properties.

## Installation

```bash
npm install @itrocks/class-type
```

The library is published in both CommonJS and ESModule formats and includes TypeScript type definitions.

## Overview

This library provides utility types and functions to work more seamlessly with JavaScript/TypeScript classes, objects,
and their constructors. It helps identify, inspect, and manipulate objects and their associated class types at runtime.
In particular, `@itrocks/class-type` focuses on classes and objects where properties are strings.
For domain objects, this means that numeric and symbol properties are not supported, ensuring stronger type safety and
predictability in handling object structures.

## Types

### AnyObject

```ts
type AnyObject = Record<string, any>
```
Represents a generic object with string keys and values of any type.

### KeyOf

```ts
type KeyOf<T> = Extract<keyof T, string>
```
`KeyOf<T>` is similar to `keyof T`, but it filters out non-string keys, ensuring that only string-based property names
of `T` are extracted.
This is particularly useful when working with domain objects where properties are expected to be strings.

**Example without `KeyOf<T>`:**
```ts
function displayValueOf(object: object, property: string)
{
	console.log('property ' + property, object[property])
}
```
This code will cause a TypeScript error (TS7053),
because `property` is not strongly linked to the `object` parameter's type.

**Example with `KeyOf<T>`:**
```ts
function displayValueOf<T extends object>(object: T, property: KeyOf<T>)
{
	console.log('property ' + property, object[property])
}
```
By using `KeyOf<T>`, the `property` argument must be a valid string key of `object`, providing stronger type safety.

Using `keyof T` alone would have caused a TypeScript error (TS2469), since `property` could have been a `Symbol`,
which does not support the `+` operator.

### ObjectOrType

```ts
type ObjectOrType<T extends object = object> = T | Type<T>
```
Represents either an instance of `T` or its class type `Type<T>`.

**Example:**
```ts
function doSomething(arg: ObjectOrType) {}

doSomething(new Object)   // instance of object
doSomething(Object)       // constructor for Object
doSomething(class {})     // Anonymous class constructor
```
All these calls are valid and type-checked by TypeScript.

### StringObject

```ts
type StringObject = Record<string, string>
```
Represents an object where both keys and values are strings.

### Type

```ts
type Type<T extends object = object> = new (...args: any[]) => T
```
This type helper represents a class for objects of type `T`.

Note that in JavaScript, classes are represented as constructors.

## Functions

### addReservedClassNames

```ts
function addReservedClassNames(...classNames: string[])
```
Registers specific class names as reserved.
Reserved class names are treated by [baseType](#basetype) as if they were unnamed,
allowing you to skip certain dynamically generated or overloaded classes when determining the base class.

This is particularly useful in frameworks or applications that create intermediate class layers
with predefined names that should be ignored.

**Parameters:**
- `...classNames`: A list of class names (`string[]`) to mark as reserved.

**Example:**
```ts
import { addReservedClassNames, baseType } from './class-type'

class Foo {}
class Bar extends Foo {}

console.log(baseType(Bar).name)   // Outputs 'Bar'

// Mark 'Bar' as a reserved class name
addReservedClassNames('Bar')

console.log(baseType(Bar).name)   // Outputs 'Foo'
```
In this example:
1. Without `addReservedClassNames`, `baseType` identifies `Bar` as the base class.
2. After calling `addReservedClassNames('Bar')`, the function treats `Bar` as a reserved class name,
   so it continues traversing the inheritance chain and identifies `Foo` as the base class.

### baseType

```ts
function baseType<T extends object>(target: Type<T>): Type<T>
```
Returns the base type (class/constructor) of the given class by walking up its prototype chain until it finds a
meaningful named constructor (not an empty name).
This is especially useful if your framework or application generates anonymous class wrappers
(e.g., proxy classes or dynamically built classes without a proper name).
Calling `baseType` helps you retrieve the original named class or its most relevant ancestor in the inheritance chain.

To mark certain class names as reserved words, use [addReservedClassNames](#addreservedclassnames).
These names will be treated by `baseType` as non-base classes, just as if they were unnamed.

**Parameters:**
- `target`: The class constructor from which to retrieve the base type.

**Returns:**
- The base `Type<T>` of the given target.

**Example:**
```ts
class OriginalClass {}
const AnonymousClass = (() => class extends OriginalClass {})()

console.log(baseType(AnonymousClass))   // Outputs: OriginalClass
```

### isAnyFunction

```ts
function isAnyFunction(value: any): value is Function
```
Checks if the given value is a function (excluding class constructors).

**Parameters:**
- `value`: The value to check.

**Returns:**
- `true` if value is a function, `false` otherwise.

### isAnyFunctionOrType

```ts
function isAnyFunctionOrType(value: any): value is Function | Type
```
Checks if the given value is either a function or a class constructor.

**Parameters:**
- `value`: The value to check.

**Returns:**
- `true` if value is a function or class constructor, `false` otherwise.

### isAnyObject

```ts
function isAnyObject<T extends object = object>(value: any): value is T
```
Checks if the given value is an object (excluding `null`).

**Parameters:**
- `value`: The value to check.

**Returns:**
- `true` if `value` is a non-null object, `false` otherwise.

### isAnyType

```ts
function isAnyType(value: any): value is Type
```
Checks if the given value is a class type (i.e., a function that is recognized as a class constructor).

**Parameters:**
- `value`: The value to check.

**Returns:**
- `true` if `value` is a class constructor, `false` otherwise.

### isObject

```ts
function isObject<T extends object>(target: ObjectOrType<T>): target is T
```
Checks if `target` is an object instance rather than a class constructor (i.e. a [Type](#type)).

This function is similar to [isAnyObject](#isanyobject), but it is optimized for cases where the argument is already
known to be either an object instance or a class [Type](#type).

**Parameters:**
- `target`: Either an object or a class constructor.

**Returns:**
- `true` if target is an `T` object instance, `false` if it is a [Type](#type).

### isType

```ts
function isType<T extends object>(target: ObjectOrType<T>): target is Type<T>
```
Checks if `target` is a class constructor (i.e. a [Type](#type)) rather than an object instance.

This function is similar to [isAnyType](#isanytype), but it is optimized for cases where the argument is already
known to be either an object instance or a class [Type](#type).

**Parameters:**
- `target`: Either an object or a class constructor.

**Returns:**
- `true` if target is a [Type](#type) (i.e. class constructor), `false` if it is a `T` object instance.

### prototypeOf

```ts
function prototypeOf<T extends object>(target: ObjectOrType<T>): T
```
Returns `target` as a prototype.

If `target` is a class constructor (i.e. [Type](#type), it returns `target.prototype`.\
If `target` is an object instance, it returns `target` itself.

**Parameters:**
- `target`: Either an object or a class constructor.

**Returns:**
- The prototype object of the given target.

### typeIdentifier

```ts
function typeIdentifier(type: Type): Symbol
```
Returns a [Symbol](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
for the given class constructor (i.e. [Type](#type)).

**Parameters:**
- `type`: The class constructor.

**Returns:**
- A unique Symbol associated with that type’s constructor name.

### typeOf

```ts
function typeOf<T extends object>(target: ObjectOrType<T>): Type<T>
```
Retrieves the [Type](#type) (i.e. class constructor) for `target`.
If `target` is an object, it returns its [Type](#type);
if `target` is already a [Type](#type), it returns it as-is.

**Parameters:**
- `target`: Either an object or a [Type](#type) (i.e. class constructor).

**Returns:**
- The `Type<T>` representing the [Type](#type) of `target`.
