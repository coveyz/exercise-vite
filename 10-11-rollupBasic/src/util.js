export const add = (a, b) => {
	return a + b;
};

export * from './multi';

export const testSideEffect = (obj) => {
	console.log(obj.x);
};
