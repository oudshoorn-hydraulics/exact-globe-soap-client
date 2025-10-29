import {DOMParser} from '@xmldom/xmldom';
import axios from 'axios';

import type {ExactError} from './utils';

export function exceptionResult(err: unknown): ExactError {
    if (axios.isAxiosError(err) && err.response) {
        let statusCode: number | undefined;
        let exactError: string | undefined;

        if (typeof err.response.status === 'number') {
            statusCode = err.response.status;
        }

        if (typeof err.response.data === 'string' && err.response.data.trim()) {
            exactError = extractErrorMessage(err.response.data);
        }

        return {
            error: err.message,
            statusCode: statusCode,
            exactError: exactError,
            exception: err,
        };
    }

    if (err instanceof Error) {
        return {
            error: err.message,
            exception: err,
        };
    }

    return {
        error: String(err),
    };
}

/**
 * Extract the error message from an Exact response XML object.
 */
export function extractErrorMessage(xml: string): string | undefined {
    const parser = new DOMParser();

    let xmlDocument: Document | undefined;

    try {
        xmlDocument = parser.parseFromString(xml, 'text/xml');
    } catch (err) {
        return `Error while parsing Exact XML error response ${err instanceof Error ? err.message : String(err)}`;
    }

    if (!xmlDocument) {
        return `Could not parse XML error document with content: ${xml}`;
    }

    let exceptions = xmlDocument.getElementsByTagName('Exceptions');

    // When no generic exception is found, look for specific entity errors.
    if (!exceptions.length || !exceptions.item(0)?.childNodes.length) {
        exceptions = xmlDocument.getElementsByTagName('EntityFault');
    }

    if (!exceptions.length || !exceptions.item(0)?.childNodes.length) {
        return;
    }

    const messages = exceptions.item(0)?.getElementsByTagName('Message');
    if (!messages || !messages.length) {
        return;
    }

    return messages.item(0)?.childNodes.item(0).nodeValue ?? undefined;
}
