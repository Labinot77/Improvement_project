export function capitalizeFirstLetter(str: string) {
    if (!str) return str;
    return str.at(0)?.toUpperCase() + str.slice(1);
}