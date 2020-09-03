import { Button, Flex, Link, Text } from "@chakra-ui/core"
import { Form, Formik } from "formik"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { InputField } from "../../components/InputField"
import { Wrapper } from "../../components/Wrapper"
import { useChangePasswordMutation } from "../../generated/graphql"
import { createUrqlClient } from "../../utils/createUrqlClient"
import { toErrorMap } from "../../utils/toErrorMap"

export const ChangePassword: NextPage<{ token: string }> = () => {
	const router = useRouter()
	const [, changePassword] = useChangePasswordMutation()
	const [tokenError, setTokenError] = useState("")
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ newPassword: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({
						newPassword: values.newPassword,
						token: typeof router.query.token === "string" ? router.query.token : "",
					})
					if (response.data?.changePassword.errors) {
						const errorMap = toErrorMap(response.data.changePassword.errors)
						if ("token" in errorMap) {
							setTokenError(errorMap.token)
						}
						setErrors(errorMap)
					} else if (response.data?.changePassword.user) {
						router.push("/")
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField name="newPassword" placeholder="new password" label="New Password" type="password" />
						{tokenError && (
							<Flex>
								<Text mr={2} color="#FC8181">
									{tokenError}
								</Text>
								<NextLink href="/forgot-password">
									<Link>forget it again</Link>
								</NextLink>
							</Flex>
						)}
						<Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
							change password
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	)
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
