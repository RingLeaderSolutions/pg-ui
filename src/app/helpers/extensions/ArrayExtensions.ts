declare global {
    interface Array<T> {
        /**
         * Projects each element of an array into an Array<TOut> and flattens the resulting arrays into one array.
         * @param this The source array
         * @param selector The selector function, providing the arrays to flatten
         */
        SelectMany<T, TOut>(this: T[], selector: (t: T) => TOut[]): TOut[];
        
        /**
         * Returns a boolean indicating whether an array is null, or contains no elements.
         * @param this The array to check
         */
        IsNullOrEmpty(this: Array<T>): boolean;
    }
}

Array.prototype.IsNullOrEmpty = function<T>(this: Array<T>): boolean {
    return this === null || this === undefined || this.length === 0;
}

Array.prototype.SelectMany = function<T, TOut>(this: T[], selector: (t: T) => TOut[]): TOut[] {
    return this.reduce((out, inx) => {
        out.push(...selector(inx));
        return out;
    }, new Array<TOut>());
}

export {};