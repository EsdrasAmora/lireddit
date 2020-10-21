import { ApolloServer } from "apollo-server-express"
import "dotenv-safe/config"
import connectRedis from "connect-redis"
import cors from "cors"
import express from "express"
import session from "express-session"
import Redis from "ioredis"
import "reflect-metadata"
import { buildSchema } from "type-graphql"
import { createConnection } from "typeorm"
import { COKKIE_NAME, __prod__ } from "./constants"
import { Post } from "./entities/Post"
import { User } from "./entities/User"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import path from "path"
import { Updoot } from "./entities/Updoot"
import { createUserLoader } from "./utils/createUserLoader"
import { createUpdootLoader } from "./utils/createUpdootLoader"

const main = async () => {
	const conn = await createConnection({
		url: process.env.DATABASE_URL,
		password: !__prod__ ? process.env.POSTGRES_PASSWORD : undefined,
		type: "postgres",
		logging: true,
		//synchronize: true,
		migrations: [path.join(__dirname, "./migrations/*")],
		entities: [Post, User, Updoot],
	})

	await conn.runMigrations()
	// await Post.delete({})

	const app = express()

	const RedisStore = connectRedis(session)
	app.set("trust proxy", 1)
	const redis = new Redis(process.env.REDIS_URL)
	app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
	app.use(
		session({
			name: COKKIE_NAME,
			store: new RedisStore({
				client: redis,
				disableTouch: true,
			}),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: true,
				sameSite: "lax",
				secure: __prod__,
				domain: __prod__ ? ".berrycode.xyz" : undefined,
			},
			saveUninitialized: false,
			secret: process.env.SESSION_SECRET,
			resave: false,
		})
	)

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({
			req,
			res,
			redis,
			userLoader: createUserLoader(),
			updootLoader: createUpdootLoader(),
		}),
	})

	apolloServer.applyMiddleware({ app, cors: false })

	app.listen(parseInt(process.env.PORT), () => {
		console.log("server started on localhost:4000")
	})
}

main()
