import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput"

export const validateRegister = (options: UsernamePasswordInput) => {
	if (options.username.length <= 3) {
		return [
			{
				field: "username",
				message: "length must be greather than 3",
			},
		]
	}
	if (options.username.includes("@")) {
		return [
			{
				field: "username",
				message: "cannot add an @",
			},
		]
	}

	if (!options.email.includes("@")) {
		return [
			{
				field: "email",
				message: "invalid email",
			},
		]
	}

	if (options.password.length <= 2) {
		return [
			{
				field: "password",
				message: "length must be greather than 2",
			},
		]
	}

	return null
}
