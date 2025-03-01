/// <reference types="vite/client" />

declare module '*.sql' {
  const src: string
  export default src
}
