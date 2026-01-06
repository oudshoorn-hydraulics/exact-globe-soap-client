import path from 'node:path';
import {fileURLToPath} from 'node:url';
import util from 'node:util';

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

export function getDirname(): string {
    if (typeof import.meta.url !== 'undefined') {
        return path.dirname(fileURLToPath(import.meta.url));
    } else {
        return __dirname;
    }
}
