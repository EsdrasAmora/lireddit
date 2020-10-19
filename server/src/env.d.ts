declare namespace NodeJS {
	export interface ProcessEnv {
		DATABASE_URL: string
		SESSION_SECRET: string
		POSTGRES_PASSWORD: string
		CORS_ORIGIN: string
		REDIS_HOST: string
		PORT: string
	}
}
