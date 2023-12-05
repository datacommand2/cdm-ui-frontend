import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import envCompatible from 'vite-plugin-env-compatible';
import checker from 'vite-plugin-checker';

export default defineConfig({
    plugins: [
        react(),
        viteTsconfigPaths(),
        checker({ typescript: true, eslint: { lintCommand: 'eslint ./src --ext .ts,.tsx ' } }),
        envCompatible({ prefix: 'REACT_APP' }),
    ],
    optimizeDeps: {
        include: ['@mui/material/Unstable_Grid2'],
    },
    build: {
        outDir: 'build',
    },
    server: {
        // 기본 포트 설정
        port: 3000,
        // 서버 시작 시 자동으로 브라우저 열기
        open: true,
    },
});
