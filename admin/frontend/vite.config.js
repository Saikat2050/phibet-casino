/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.VITE_APP_PORT
	? parseInt(process.env.VITE_APP_PORT, 10)
	: 8080;

export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
			usePolling: true,
		},
		host: true,
		strictPort: true,
		port,
		allowedHosts: ['dev-admin.phibet.com'],
	},
	preview: {
		port,
		allowedHosts: ['dev-admin.phibet.com'],
	},
});
