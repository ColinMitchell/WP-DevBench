import {ValidatorType} from "@rjsf/utils";

/**
 * This is an override to disable the validator that comes with react-jsonschema-forms. I ran into WebPack errors with it.
 */
export const noValidator: ValidatorType<any, any, any> = {
	validateFormData: (formData: any): { valid: boolean; errors: any[]; errorSchema: {} } => {
		// Return an object with errors, valid status, and an empty error schema
		return {
			errors: [],
			valid: true,
			errorSchema: {}, // Add errorSchema here
		};
	},
	toErrorList: (errors: any) => {
		// Convert errors to an empty list
		return [];
	},
	isValid: (errors: any) => {
		// Return true as no errors mean valid
		return errors.length === 0;
	},
	rawValidation: (formData: any) => {
		// Return an object with an empty errors array and errorSchema
		return {
			errors: [],
			errorSchema: {}, // Add errorSchema here
		};
	},
};
