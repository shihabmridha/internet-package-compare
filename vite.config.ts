import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/internet-packs': {
                target: 'https://www.grameenphone.com/personal/plans-offers/internet-packages',
                changeOrigin: true
            }
        }
    }
})
