import { Box, Button } from "@chakra-ui/core"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { InputField } from "../../../components/InputField"
import { Layout } from "../../../components/Layout"
import { usePostQuery, useUpdatePostMutation } from "../../../generated/graphql"
import { createUrqlClient } from "../../../utils/createUrqlClient"
import { useGetIntId } from "../../../utils/useGetIntId"

export const EditPost: React.FC<{}> = ({}) => {
	const router = useRouter()
	const intId = useGetIntId()
	const [{ data, error, fetching }] = usePostQuery({
		pause: intId === -1,
		variables: {
			id: intId,
		},
	})
	const [, updatePost] = useUpdatePostMutation()

	if (fetching) {
		return (
			<Layout>
				<div>Loading...</div>
			</Layout>
		)
	}

	if (error) {
		return <Layout>{error.message}</Layout>
	}

	if (!data?.post) {
		return (
			<Layout>
				<Box>could not find the post</Box>
			</Layout>
		)
	}

	return (
		<Layout variant="small">
			<Formik
				initialValues={{ title: data.post.title, text: data.post.text }}
				onSubmit={async (values, { setErrors }) => {
					updatePost({ ...values, id: intId })
					router.back()
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField name="title" placeholder="title" label="Title" />
						<Box mt={4}>
							<InputField textArea name="text" placeholder="text..." label="Body" />
						</Box>

						<Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
							Edit Post
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	)
}

export default withUrqlClient(createUrqlClient)(EditPost)
