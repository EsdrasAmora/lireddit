import React from "react"
import { Box, Link, Flex, Button, Heading } from "@chakra-ui/core"
import NextLink from "next/link"
import { useMeQuery, useLogoutMutation } from "../generated/graphql"
import { useRouter } from "next/router"

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const router = useRouter()
	const [{ data, fetching }] = useMeQuery()
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
	let body = null

	if (fetching) {
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href="/login">
					<Link mr={4}>Login</Link>
				</NextLink>
				<NextLink href="/register">
					<Link>register </Link>
				</NextLink>
			</>
		)
	} else {
		body = (
			<Flex align="center">
				<NextLink href="/create-post">
					<Button mr={4} as={Link}>
						Create Post
					</Button>
				</NextLink>
				<Box mr={2}>{data.me.username}</Box>
				<Button
					onClick={async () => {
						await logout()
						router.reload()
					}}
					isLoading={logoutFetching}
					variant="link"
				>
					logout
				</Button>
			</Flex>
		)
	}
	return (
		<Flex zIndex={1} position="sticky" top={0} bg="#7A2448" p={4}>
			<Flex flex={1} maxW={800} align="center" margin="auto">
				<NextLink href="/">
					<Link>
						<Heading>LireReddit</Heading>
					</Link>
				</NextLink>
				<Box ml={"auto"}>{body}</Box>
			</Flex>
		</Flex>
	)
}
