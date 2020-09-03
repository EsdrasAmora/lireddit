import { Box, Button, Link, Flex } from "@chakra-ui/core"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { InputField } from "../components/InputField"
import { Wrapper } from "../components/Wrapper"
import { useLoginMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { toErrorMap } from "../utils/toErrorMap"
import NextLink from "next/link"

const login: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [, login] = useLoginMutation()

	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ usernameOrEmail: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login(values)
					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors))
					} else if (response.data?.login.user) {
						if (typeof router.query.next === "string") {
							router.push(router.query.next)
						} else {
							router.push("/")
						}
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField name="usernameOrEmail" placeholder="username or email" label="Username or Email" />
						<Box mt={4}>
							<InputField name="password" placeholder="Password" label="Password" type="Password" />
						</Box>
						<Flex mt={2}>
							<NextLink href="/forgot-password">
								<Link ml="auto">Forgot Password ?</Link>
							</NextLink>
						</Flex>
						<Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
							login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	)
}

export default withUrqlClient(createUrqlClient)(login)
