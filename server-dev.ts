import { watch } from "fs";
import type { ServerWebSocket } from "bun";
import { HandleRoute } from "./router";

// First, let's define our custom data type
interface WebSocketData {
    message: string;
}

// Keep track of all connected WebSocket clients with proper typing
const clients = new Set<ServerWebSocket<WebSocketData>>();

// Create WebSocket server handlers
const wsOptions = {
    // We use proper typing for the WebSocket parameter
    open(ws: ServerWebSocket<WebSocketData>) {
        clients.add(ws);
        console.log('Client connected');
    },
    close(ws: ServerWebSocket<WebSocketData>) {
        clients.delete(ws);
        console.log('Client disconnected');
    },
    message(ws: ServerWebSocket<WebSocketData>, message: string) {
        // Handle incoming messages if needed
    }
};

// Server setup remains the same
const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        try {
            const url = new URL(req.url);
            
            // Handle WebSocket upgrade requests
            if (url.pathname === "/livereload") {
                const upgraded = server.upgrade(req, {
                    data: { message: 'Initial connection' }
                });
                
                if (!upgraded) {
                    console.error('WebSocket upgrade failed');
                    return new Response("WebSocket upgrade failed", { status: 400 });
                }
                return new Response();
            }

            // For regular page requests, inject our livereload client script
            const pageResponse = await HandleRoute(url.pathname);
            const html = await pageResponse.text();
            
            // Enhanced live reload script with error handling and reconnection logic
            const liveReloadScript = `
                <script>
                    (function() {
                        let reconnectAttempts = 0;
                        const maxReconnectAttempts = 5;
                        
                        function connectWebSocket() {
                            const ws = new WebSocket('ws://' + window.location.host + '/livereload');
                            
                            ws.onmessage = (event) => {
                                if (event.data === 'reload') {
                                    console.log('Reloading page due to file change');
                                    window.location.reload();
                                }
                            };

                            ws.onclose = () => {
                                console.log('WebSocket connection closed');
                                if (reconnectAttempts < maxReconnectAttempts) {
                                    reconnectAttempts++;
                                    console.log(\`Reconnecting (attempt \${reconnectAttempts})\`);
                                    setTimeout(connectWebSocket, 1000);
                                } else {
                                    console.error('Max reconnection attempts reached');
                                }
                            };

                            ws.onerror = (error) => {
                                console.error('WebSocket error:', error);
                            };
                        }

                        connectWebSocket();
                    })();
                </script>
            </body>`;
            
            const modifiedHtml = html.replace('</body>', liveReloadScript);
            
            return new Response(modifiedHtml, {
                headers: {
                    'Content-Type': 'text/html',
                }
            });
        } catch (error) {
            console.error('Server error:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    },
    websocket: wsOptions,
});

// For the debouncing timer, we need to use NodeJS.Timeout
let timeoutId: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 100;

// Watch for file changes with debouncing
const watcher = watch('./src', { recursive: true }, (eventType, filename) => {
    if (filename) {
        if (timeoutId) clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            console.log(`File changed: ${filename}`);
            
            // Use proper typing for the WebSocket client
            for (const client of clients) {
                try {
                    client.send('reload');
                } catch (error) {
                    console.error('Error sending reload message:', error);
                    clients.delete(client);
                }
            }
        }, DEBOUNCE_DELAY);
    }
});

// Clean up resources on server shutdown
process.on('SIGINT', () => {
    watcher.close();
    for (const client of clients) {
        client.close();
    }
    process.exit();
});

console.log(`Development server running at http://localhost:${server.port}`);