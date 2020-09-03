import DataLoader from "dataloader"
import { Updoot } from "../entities/Updoot"

export const createUpdootLoader = () =>
	new DataLoader<{ postId: number; userId: number }, Updoot | null>(async (keys) => {
		const updoots = await Updoot.findByIds(keys as any)
		const updootIdToUpdoot: Record<string, Updoot> = {}
		updoots.forEach((updoot) => {
			updootIdToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot
		})

		return keys.map((key) => updootIdToUpdoot[`${key.userId}|${key.postId}`])
	})
