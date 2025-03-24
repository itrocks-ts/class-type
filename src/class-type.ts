
export type AnyObject = Record<string, any>

export type KeyOf<T> = Extract<keyof T, string>

export type ObjectOrType<T extends object = object> = T | Type<T>

export type StringObject = Record<string, string>

export type Type<T extends object = object> = new (...args: any[]) => T

const reservedClassNames: string[] = []

export function addReservedClassNames(...classNames: string[])
{
	reservedClassNames.push(...classNames)
	if (baseType !== baseTypeWithReservedClassNames) {
		baseType = baseTypeWithReservedClassNames
	}
}

export let baseType = <T extends object>(target: Type<T>): Type<T> =>
{
	while (!target.name.length) {
		target = Object.getPrototypeOf(target)
	}
	return target
}

function baseTypeWithReservedClassNames<T extends object>(target: Type<T>): Type<T>
{
	while (!target.name.length || reservedClassNames.includes(target.name)) {
		target = Object.getPrototypeOf(target)
	}
	return target
}

export function inherits<T extends object, S extends object>(type: Type<S|T>, superType: Type<S>): type is Type<S&T>
{
	while (type) {
		if (type === superType) return true
		type = Object.getPrototypeOf(type)
	}
	return false
}

export function isAnyFunction(value: any): value is Function
{
	return ((typeof value)[0] === 'f') && ((value + '')[0] !== 'c')
}

export function isAnyFunctionOrType(value: any): value is Function | Type
{
	return (typeof value)[0] === 'f'
}

export function isAnyObject<T extends object = object>(value: any): value is T
{
	return value && ((typeof value)[0] === 'o')
}

export function isAnyType(value: any): value is Type
{
	return ((typeof value)[0] === 'f') && ((value + '')[0] === 'c')
}

export function isObject<T extends object>(target: ObjectOrType<T>): target is T
{
	return (typeof target)[0] === 'o'
}

export function isType<T extends object>(target: ObjectOrType<T>): target is Type<T>
{
	return (typeof target)[0] === 'f'
}

export function prototypeOf<T extends object>(target: ObjectOrType<T>): T
{
	return isType(target) ? target.prototype : target
}

export function typeIdentifier(type: Type)
{
	return Symbol.for(type.prototype.constructor.name)
}

export function typeOf<T extends object>(target: ObjectOrType<T>): Type<T>
{
	return isObject(target)
		? Object.getPrototypeOf(target).constructor
		: target
}
