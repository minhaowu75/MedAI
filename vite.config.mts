import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(
    {
        plugins: [react()],
        build: {
            outDir: './static',
            rollupOptions: {
                input: {
                    'script' : 'src/script.tsx',
                    'index' : 'src/index.css',
            },
            },
        },
        optimizeDeps: {
            exclude: ['lucide-react']
        },
    }
)

