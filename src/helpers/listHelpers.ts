export function selectMany<TIn, TOut>(input: TIn[], selectListFn: (t: TIn) => TOut[]): TOut[] {
    return input.reduce((out, inx) => {
        out.push(...selectListFn(inx));
        return out;
    }, new Array<TOut>());
}