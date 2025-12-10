import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base: '', // <- YOUR repo name
  base: '/ccl2Frontend/', // <- YOUR repo name
  plugins: [react()]
})
