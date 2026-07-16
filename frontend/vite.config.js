import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } }, build: { rollupOptions: { output: { manualChunks: function (id) { if (!id.includes('node_modules'))
                    return; if (id.includes('recharts') || id.includes('d3-'))
                    return 'charts'; if (id.includes('@reduxjs') || id.includes('react-redux'))
                    return 'state'; if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform'))
                    return 'forms'; if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/'))
                    return 'react-vendor'; if (id.includes('lucide-react'))
                    return 'icons'; } } } } });
