export function StringsAreNotNullOrEmpty(...values: string[]){
    return values.every(s => {
        return StringIsNotNullOrEmpty(s);
    })
}

export function StringIsNotNullOrEmpty(s: string){
    return s != null && s != undefined && s.length > 0;
}