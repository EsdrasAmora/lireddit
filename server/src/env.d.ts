declare namespace NodeJS {
	export interface ProcessEnv {
		DATABASE_URL: string
		POSTGRES_PASSWORD: string
		SESSION_SECRET: string
		CORS_ORIGIN: string
		REDIS_URL: string
		PORT: string
	}
}
