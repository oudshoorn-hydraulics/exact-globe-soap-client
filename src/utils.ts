import util from 'util';

export function parseNumber(value: string): number | undefined {
    const rawNumber = parseFloat(value);

    if (isNaN(rawNumber)) {
        return;
    }

    return rawNumber;
}

export function inspect(data: unknown): void {
    // eslint-disable-next-line
    console.log(util.inspect(data, {showHidden: false, depth: null, colors: true}));
}
