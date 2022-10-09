export function cartesian<T>(args: T[][]): T[][] {
    return args.reduce((a: T[][], b: T[]) => a.flatMap(d => b.map(e => [...d, e])), [[]] as T[][]);
}