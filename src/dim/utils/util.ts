import _ from 'lodash';
// import { tempContainer } from './temp-container';

/**
 * Count the number of values in the list that pass the predicate.
 */
export function count<T>(
	list: readonly T[],
	predicate: (value: T) => boolean | null | undefined
): number {
	return _.sumBy(list, (item) => (predicate(item) ? 1 : 0));
}

// TODO: maybe we need a type utils file?
// Create a type from the keys of an object type that map to values of type PropType
type PropertiesOfType<T, PropType> = keyof {
	[K in keyof T as T[K] extends PropType ? K : never]: T[K];
};

/**
 * This is similar to _.keyBy, but it specifically handles keying multiple times per item, where
 * the keys come from an array property.
 *
 * given the key 'key', turns
 * [           { key: [1, 3] },      { key: [2, 4] } ]
 * into { '1': { key: [1, 3] }, '2': { key: [2, 4], '3': { key: [1, 3] }, '4': { key: [2, 4] } }
 */
export function objectifyArray<T>(
	array: T[],
	key: PropertiesOfType<T, any[]>
): NodeJS.Dict<T> {
	return array.reduce<NodeJS.Dict<T>>((acc, val) => {
		const prop = val[key] as any[];
		for (const eachKeyName of prop) {
			acc[eachKeyName] = val;
		}
		return acc;
	}, {});
}

/**
 * Produce a function that can memoize a calculation about an item. The cache is backed by
 * a WeakMap so when the item is garbage collected the cache is freed up too.
 */
export function weakMemoize<T extends object, R>(
	func: (arg0: T) => R
): (arg1: T) => R {
	const cache = new WeakMap<T, R>();
	return (arg: T): R => {
		if (cache.has(arg)) {
			return cache.get(arg)!;
		}

		const value = func(arg);
		cache.set(arg, value);
		return value;
	};
}

/**
 * Transform an async function into a version that will only execute once at a time - if there's already
 * a version going, the existing promise will be returned instead of running it again.
 */
export function dedupePromise<T extends unknown[], K>(
	func: (...args: T) => Promise<K>
): (...args: T) => Promise<K> {
	let promiseCache: Promise<K> | null = null;
	return async (...args: T) => {
		if (promiseCache) {
			return promiseCache;
		}
		promiseCache = func(...args);
		try {
			return await promiseCache;
		} finally {
			promiseCache = null;
		}
	};
}

// setTimeout as a promise
export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Copy a string to the clipboard */
export function copyString(str: string) {
	navigator.clipboard.writeText(str);
}

// /** Download a string as a file */
// export function download(data: string, filename: string, type: string) {
//   const a = document.createElement('a');
//   a.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(data)}`);
//   a.setAttribute('download', filename);
//   tempContainer.appendChild(a);
//   a.click();
//   setTimeout(() => tempContainer.removeChild(a));
// }

/**
 * Given an index into an array, which may exceed the bounds of the array in either direction,
 * return a new index that "wraps around".
 *
 * Example:
 * [0, 1][wrap(-1, 2)] === 1
 */
export const wrap = (index: number, length: number) => {
	while (index < 0) {
		index += length;
	}
	while (index >= length) {
		index -= length;
	}
	return index;
};

/**
 * A faster replacement for _.uniqBy that uses a Set internally
 */
export function uniqBy<T, K>(
	data: Iterable<T>,
	iteratee: (input: T) => K
): T[] {
	const dedupe = new Set<K>();
	const result: T[] = [];
	for (const d of data) {
		const mapped = iteratee(d);
		if (!dedupe.has(mapped)) {
			result.push(d);
			dedupe.add(mapped);
		}
	}
	return result;
}

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
	? (Without<T, U> & U) | (Without<U, T> & T)
	: T | U;

/**
 * If the parameter is not an Error, wrap a stringified version of it in an
 * Error. Meant to be used from catch blocks where the thrown type is not known.
 */
export function convertToError(e: unknown): Error {
	if (e instanceof Error) {
		return e;
	}
	return new Error(JSON.stringify(e));
}

/*
 * Stable empty versions of common data structures, to use in reducers.
 *
 * These always return the same instance so they'll always be referentially equal.
 */

const EMPTY_OBJ = Object.freeze({});
export function emptyObject<
	T extends Record<string, unknown> | Record<number, unknown>
>(): T {
	return EMPTY_OBJ as T;
}

const EMPTY_ARRAY: readonly unknown[] = Object.freeze<unknown>([]);
export function emptyArray<T>(): T[] {
	return EMPTY_ARRAY as T[];
}

const EMPTY_SET = Object.freeze(new Set());
export function emptySet<T>(): Set<T> {
	return EMPTY_SET as Set<T>;
}

const EMPTY_MAP = Object.freeze(new Map());
export function emptyMap<K, V>(): Map<K, V> {
	return EMPTY_MAP as Map<K, V>;
}

/*
 * Expand a relative bungie.net asset path to a full path.
 */
export function bungieNetPath(src: string): string {
	if (!src) {
		return '';
	}
	if (src.startsWith('~')) {
		return src.substring(1);
	}
	return `https://www.bungie.net${src}`;
}
