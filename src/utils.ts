import util from "util";

export type ExactError = {
    error: string;
    exactError?: string;
    statusCode?: number;
    exception?: unknown;
};

export function parseNumber(value: string): number | undefined {
    const rawNumber = parseFloat(value);

    if (isNaN(rawNumber)) {
        return;
    }

    return rawNumber;
}

export function inspect(data: unknown): void {
    console.log(util.inspect(data, {showHidden: false, depth: null, colors: true}));
}
