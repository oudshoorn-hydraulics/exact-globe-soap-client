export function parseNumber(value: string): number | undefined {
    const rawNumber = parseFloat(value);

    if (isNaN(rawNumber)) {
        return;
    }

    return rawNumber;
}
