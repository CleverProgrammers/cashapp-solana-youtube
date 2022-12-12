export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

export const truncate = (longString, limit = 10) => {
    if (longString.length > limit) {
        return longString.substring(0, limit) + '...'
    }

    return longString
}
