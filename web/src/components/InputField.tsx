import React, { HTMLAttributes, InputHTMLAttributes } from "react"
import { useField } from "formik"
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from "@chakra-ui/core"

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; textArea?: boolean }

export const InputField: React.FC<InputFieldProps> = ({ label, textArea, size: _, ...props }) => {
	let InputOrTextarea = Input
	if (textArea) {
		InputOrTextarea = Textarea
	}
	const [field, { error }] = useField(props)
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<InputOrTextarea {...field} {...props} id={field.name} placeholder={label} />
			{error && <FormErrorMessage>{error}</FormErrorMessage>}
		</FormControl>
	)
}
