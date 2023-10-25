import { defineConfig, loadEnv, ConfigEnv, UserConfigExport } from "vite";
import react from "@vitejs/plugin-react";
import viteSvgr from "vite-plugin-svgr";
import eslint from "vite-plugin-eslint";

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react(), viteSvgr(), eslint()],
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    server: {
      port: env.VITE_APP_PORT as unknown as number,
    },
  });
};
