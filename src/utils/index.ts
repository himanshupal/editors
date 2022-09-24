export const join = (...classes: Array<string | boolean>) => classes.filter((x) => x).join(' ');
