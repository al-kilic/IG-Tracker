export declare class InvalidZipError extends Error {
    readonly code: "INVALID_ZIP";
    constructor(cause?: unknown);
}
export declare class MissingFilesError extends Error {
    readonly code: "MISSING_FILES";
    constructor(missing: string[]);
}
export declare class MixedFormatError extends Error {
    readonly code: "MIXED_FORMAT";
    constructor();
}
export declare class SchemaValidationError extends Error {
    readonly code: "SCHEMA_VALIDATION";
    constructor(filename: string, detail: string);
}
//# sourceMappingURL=errors.d.ts.map