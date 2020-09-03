import React from "react"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../../utils/createUrqlClient"
import { Layout } from "../../components/Layout"
import { Heading, Box } from "@chakra-ui/core"
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl"
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons"

const Post: React.FC<{}> = ({}) => {
	const [{ data, error, fetching }] = useGetPostFromUrl()

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
		<Layout>
			<Heading mb={4}>{data.post.title}</Heading>
			<Box mb={4}>{data.post.text}</Box>
			<EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />
		</Layout>
	)
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
