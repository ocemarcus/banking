import crypto from "crypto";

export const Password = {
	hashPassword(password: string) {
		const salt = crypto.randomBytes(16).toString("hex");
		const hash = crypto
			.pbkdf2Sync(password, salt, 1000, 64, "sha512")
			.toString("hex");
		return `${hash}.${salt}`;
	},

	compare(storedPassword: string, suppliedPassword: string) {
		const [hashedPassword, salt] = storedPassword.split(".");
		const newHash = crypto
			.pbkdf2Sync(suppliedPassword, salt, 1000, 64, "sha512")
			.toString("hex");
		return newHash === hashedPassword;
	},
};
