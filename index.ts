import { ren } from 'react-dom';
import HomePage from "./src/pages/HomePage";

const server = Bun.serve({
    static: {
        '/': HomePage
    }
})