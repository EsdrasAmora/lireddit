import React, { useState } from "react"
import { Flex, IconButton } from "@chakra-ui/core"
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql"

interface UpdootSectionProps {
	post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
	const [, vote] = useVoteMutation()
	const [loadingState, setLoadingState] = useState<"updoot-loading" | "downdoot-loading" | "not-loading">("not-loading")
	return (
		<Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
			<IconButton
				onClick={async () => {
					if (post.voteStatus === 1) {
						return
					}
					setLoadingState("updoot-loading")
					await vote({ postId: post.id, value: 1 })
					setLoadingState("not-loading")
				}}
				isLoading={loadingState === "updoot-loading"}
				icon="chevron-up"
				aria-label="updoot post"
				variantColor={post.voteStatus === 1 ? "green" : undefined}
			/>
			{post.points}
			<IconButton
				onClick={async () => {
					if (post.voteStatus === -1) {
						return
					}
					setLoadingState("downdoot-loading")
					await vote({ postId: post.id, value: -1 })
					setLoadingState("not-loading")
				}}
				isLoading={loadingState === "downdoot-loading"}
				icon="chevron-down"
				aria-label="downdoot post"
				variantColor={post.voteStatus === -1 ? "red" : undefined}
			/>
		</Flex>
	)
}
