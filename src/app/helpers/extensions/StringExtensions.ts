declare global {
    interface String {
        /**
         * Checks if a string is null, undefined or empty.
         * @param this The string to check.
         */
        IsNullOrEmpty(this: string): boolean;

        /**
         * Checks if a string is null, undefined, empty, or whitespace.
         * @param this The string to check.
         */
        IsNullOrWhitespace(this: string): boolean;
    }
}

String.prototype.IsNullOrEmpty = function(this: string): boolean {
    return this === null || this === undefined || this.length == 0;
};

String.prototype.IsNullOrWhitespace = function(this: string): boolean {
    if(this.IsNullOrEmpty()){
        return true;
    }

    let trimmed = this.trim();
    return trimmed.IsNullOrEmpty();
};

export {};