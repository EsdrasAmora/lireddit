import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import { useState } from "react"
import { EditDeletePostButtons } from "../components/EditDeletePostButtons"
import { Layout } from "../components/Layout"
import { UpdootSection } from "../components/UpdootSection"
import { usePostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

const Index = () => {
	const [variables, setVariables] = useState({ limit: 15, cursor: null as string | null })
	const [{ data, error, fetching }] = usePostsQuery({
		variables,
	})

	if (!fetching && !data) {
		return (
			<div>
				<div>something went wrong</div>
				<div>{error?.message}</div>
			</div>
		)
	}

	return (
		<Layout>
			<Stack mt={10}>
				{fetching && !data ? (
					<div>Loading ...</div>
				) : (
					data!.posts.posts.map((post) =>
						!post ? null : (
							<Flex p={5} key={post.id} shadow="md" borderWidth="1px">
								<UpdootSection post={post} />
								<Box flex={1}>
									<NextLink href="/post/[id]" as={`/post/${post.id}`}>
										<Link>
											<Heading fontSize="xl">{post.title}</Heading>
										</Link>
									</NextLink>
									<Text>by {post.creator.username}</Text>
									<Flex align="center">
										<Text flex={1} mt={4}>
											{post.textSnippet}
										</Text>

										<Box ml="auto">
											<EditDeletePostButtons id={post.id} creatorId={post.creator.id} />
										</Box>
									</Flex>
								</Box>
							</Flex>
						)
					)
				)}
			</Stack>
			{data && data.posts.hasMore && (
				<Flex>
					<Button
						onClick={() =>
							setVariables((variables) => ({
								limit: variables.limit,
								cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
							}))
						}
						m="auto"
						isLoading={fetching}
						my={8}
					>
						load more{" "}
					</Button>
				</Flex>
			)}
		</Layout>
	)
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
