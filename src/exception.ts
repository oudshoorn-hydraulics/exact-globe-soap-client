import axios from "axios";
import {DOMParser} from "@xmldom/xmldom";

import type {ExactResult} from "./utils";

export function exceptionResult<T>(err: unknown): ExactResult<T> {
    if (axios.isAxiosError(err) && err.response) {
        let statusCode: number | undefined;
        let exactError: string | undefined;

        if (typeof err.response.status === "number") {
            statusCode = err.response.status;
        }

        if (typeof err.response.data === "string") {
            exactError = extractErrorMessage(err.response.data);
        }

        return {
            success: false,
            error: err.message,
            statusCode: statusCode,
            exactError: exactError,
            exception: err,
        };
    }

    if (err instanceof Error) {
        return {
            success: false,
            error: err.message,
            exception: err,
        };
    }

    return {
        success: false,
        error: String(err),
    };
}

/**
 * Extract the error message from an Exact response xml object.
 */
export function extractErrorMessage(xml: string): string | undefined {
    const parser = new DOMParser();
    const xmlDocument = parser.parseFromString(xml, "text/xml");
    let exceptions = xmlDocument.getElementsByTagName("Exceptions");

    // When no generic exception is found, look for specific entity errors.
    if (!exceptions.length || !exceptions.item(0)?.childNodes.length) {
        exceptions = xmlDocument.getElementsByTagName("EntityFault");
    }

    if (!exceptions.length || !exceptions.item(0)?.childNodes.length) {
        return;
    }

    const messages = exceptions.item(0)?.getElementsByTagName("Message");
    if (!messages || !messages.length) {
        return;
    }

    return messages.item(0)?.childNodes.item(0).nodeValue ?? undefined;
}
