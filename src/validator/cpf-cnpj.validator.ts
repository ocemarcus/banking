import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	ValidationOptions,
	registerDecorator,
} from "class-validator";
import { cpf, cnpj } from "cpf-cnpj-validator"; //

@ValidatorConstraint({ async: false })
export class CpfCnpjValidator implements ValidatorConstraintInterface {
	validate(documentValue: string, args: ValidationArguments) {
		const cleanDocument = documentValue.replace(/\D/g, ""); //

		if (cleanDocument.length === 11) {
			return cpf.isValid(cleanDocument);
		} else if (cleanDocument.length === 14) {
			return cnpj.isValid(cleanDocument);
		}
		return false;
	}

	defaultMessage(args: ValidationArguments) {
		return "O CPF ou CNPJ informado é inválido.";
	}
}

export function IsCpfCnpj(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: CpfCnpjValidator,
		});
	};
}
