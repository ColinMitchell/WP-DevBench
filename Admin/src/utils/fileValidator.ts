/**
 * Validates file uploads for security and accepted types
 */
export const validateFiles = (data: any, schema?: any): { valid: boolean; errors: any[] } => {
    const errors: any[] = [];

    // Build a map of field names to their accept restrictions from schema
    const acceptMap: { [key: string]: string[] } = {};

    if (schema?.properties) {
        Object.keys(schema.properties).forEach(fieldName => {
            const property = schema.properties[fieldName];
            if (property.accept) {
                // Convert accept string like ".csv,.xlsx" to array like [".csv", ".xlsx"]
                acceptMap[fieldName] = property.accept
                    .split(',')
                    .map((ext: string) => ext.trim().toLowerCase());
            }
        });
    }

    const checkFiles = (obj: any, path: string = '') => {
        if (!obj) return;

        if (typeof obj === 'string' && obj.startsWith('data:')) {
            const mimeMatch = obj.match(/^data:([^;]+)/);
            const nameMatch = obj.match(/;name=([^;]+)/);

            if (mimeMatch) {
                const mimeType = mimeMatch[1];
                const fileName = nameMatch ? nameMatch[1] : 'unknown';
                const fieldName = path;

                // Blocked MIME types
                const blockedMimeTypes = [
                    'application/x-msdownload',
                    'application/x-msdos-program',
                    'application/x-executable',
                    'application/x-sh',
                    'application/x-bat',
                    'text/javascript',
                    'application/javascript',
                ];

                // Blocked extensions
                const blockedExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.msi', '.app', '.deb', '.rpm'];

                if (blockedMimeTypes.includes(mimeType)) {
                    errors.push({
                        message: `File type "${mimeType}" is not allowed. (${fileName})`
                    });
                }

                const hasBlockedExtension = blockedExtensions.some(ext =>
                    fileName.toLowerCase().endsWith(ext)
                );

                if (hasBlockedExtension) {
                    errors.push({
                        message: `File "${fileName}" has a blocked extension`
                    });
                }

                // Check against accepted file types if specified in schema
                if (acceptMap[fieldName] && acceptMap[fieldName].length > 0) {
                    const fileExtension = '.' + fileName.split('.').pop()?.toLowerCase();
                    const isAccepted = acceptMap[fieldName].some(ext =>
                        ext === fileExtension || ext === '*'
                    );

                    if (!isAccepted) {
                        errors.push({
                            message: `File "${fileName}" is not an accepted type. Allowed: ${acceptMap[fieldName].join(', ')}`
                        });
                    }
                }

                // Check file size (10MB limit)
                const base64Data = obj.split(',')[1];
                if (base64Data) {
                    const sizeInBytes = (base64Data.length * 3) / 4;
                    const maxSize = 10 * 1024 * 1024;

                    if (sizeInBytes > maxSize) {
                        errors.push({
                            message: `File "${fileName}" exceeds maximum size of 10MB`
                        });
                    }
                }
            }
        } else if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => {
                checkFiles(obj[key], path ? `${path}.${key}` : key);
            });
        }
    };

    checkFiles(data);

    return {
        valid: errors.length === 0,
        errors
    };
};
