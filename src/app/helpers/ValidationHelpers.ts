export function StringsAreNotNullOrEmpty(...values: string[]){
    return values.every(s => {
        return s != null && s != undefined && s.length > 0;
    })
}