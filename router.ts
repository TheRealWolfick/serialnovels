import { renderToString } from "react-dom/server";
import React from "react";
import 'fs';

interface RouteModule {
    default: React.ComponentType
    layout?: React.ComponentType<{ children: React.ReactNode }>
}

// get root layout

function GetPaths(pathname: string) {

    const normalized_paths = pathname.replace(/^\/+|\/+$/g, '')
    const dirs = pathname.split('/')
    const p = [];

    for (let i = dirs.length; i >= 0; i--) {
        const current_path = dirs.slice(0,1).join('/')
        p.push(current_path)
    }
    
}

export async function HandleRoute(pathname:string) {
    try {

        // Import page based on url
        const pageModule: RouteModule = await import(`./src/pages${pathname}/page.tsx`)

        // Get highest level layout
        const tempPathname = pathname
        const directoryTree = []
    }
    catch (error) {
        console.log("Routing error: ", error);
        return new Response("Page not found", {status: 404})
    }
}