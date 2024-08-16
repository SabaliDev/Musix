interface ImportMetaEnv {
    readonly VITE_BASE_URL: string
    // Add other environment variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  