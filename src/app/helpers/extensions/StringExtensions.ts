declare global {
    interface String {
        /**
         * Checks if a string is null, undefined or empty.
         * @param this The string to check.
         */
        IsEmpty(this: string): boolean;

        /**
         * Checks if a string is null, undefined, empty, or whitespace.
         * @param this The string to check.
         */
        IsWhitespace(this: string): boolean;
    }
}

String.prototype.IsEmpty = function(this: string): boolean {
    return this.length == 0;
};

String.prototype.IsWhitespace = function(this: string): boolean {
    if(this.IsEmpty()){
        return true;
    }

    let trimmed = this.trim();
    return trimmed.IsEmpty();
};

export {};