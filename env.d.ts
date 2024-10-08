interface ImportMetaEnv {
  readonly VITE_APP_GEMINI_API: string;
  // Agrega aquí cualquier otra variable de entorno que uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}