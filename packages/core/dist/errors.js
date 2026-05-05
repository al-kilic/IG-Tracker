export class InvalidZipError extends Error {
    code = 'INVALID_ZIP';
    constructor(cause) {
        super('The file you uploaded is not a valid ZIP archive. Please try downloading it again from Instagram.');
        this.name = 'InvalidZipError';
        if (cause instanceof Error)
            this.cause = cause;
    }
}
export class MissingFilesError extends Error {
    code = 'MISSING_FILES';
    constructor(missing) {
        super(`Your Instagram export is missing required files: ${missing.join(', ')}. ` +
            'Make sure you selected "Followers and Following" when requesting your data, ' +
            'and that you chose JSON format.');
        this.name = 'MissingFilesError';
    }
}
export class MixedFormatError extends Error {
    code = 'MIXED_FORMAT';
    constructor() {
        super('Your export contains a mix of JSON and HTML files. ' +
            'Please re-download your Instagram data and choose a single format (JSON recommended).');
        this.name = 'MixedFormatError';
    }
}
export class SchemaValidationError extends Error {
    code = 'SCHEMA_VALIDATION';
    constructor(filename, detail) {
        super(`The file "${filename}" in your export has an unexpected format. ` +
            `Instagram may have changed their export structure. Detail: ${detail}`);
        this.name = 'SchemaValidationError';
    }
}
//# sourceMappingURL=errors.js.map