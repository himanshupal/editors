export const join = (...classes: Array<string | boolean | undefined>) => classes.filter(Boolean).join(' ');
