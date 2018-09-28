export class Arg {
    public static isRequired(val: any, name: string): void {
        if (val === null || val === undefined) {
            throw new Error(`The '${name}' argument is required.`);
        }
    }

    public static isRequiredNotEmpty(val:string, name: string) : void {
        this.isRequired(val, name);
        if(val === '' || !val.trim()){
            throw new Error(`The '${name}' argument cannot be empty or whitespace.`);
        }
    }

    public static isIn(val: any, values: any, name: string): void {
        // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
        if (!(val in values)) {
            throw new Error(`Unknown ${name} value: ${val}.`);
        }
    }
}

export const Wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))