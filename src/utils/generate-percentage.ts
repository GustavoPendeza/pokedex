export function generateProgressPercentage(base: number) {
    const percentage = Math.round((base / 255) * 100)

    return percentage;
}