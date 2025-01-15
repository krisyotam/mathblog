declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GHOST_API_URL: string
      GHOST_CONTENT_API_KEY: string
    }
  }
}

export {}

