import { HandleRoute } from "./router";

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        return HandleRoute(url.pathname);
    },
    development: true
});

console.log(`Server running at http://localhost:${server.port}`);