import { renderToString } from "react-dom/server";
import React from "react";
import * as fs from 'fs';

interface RouteModule {
    default: React.ComponentType
    layout?: React.ComponentType<{ children: React.ReactNode }>
}

// get root layout

export function GetPaths(pathname: string) {

    if (pathname === "/") {
        return [""]
    };

    const normalized_paths = pathname.replace(/^\/+|\/+$/g, '');
    const dirs = normalized_paths.split('/');
    const paths = [];

    for (let i = dirs.length; i > 0; i--) {
        const current_path = dirs.slice(0, i).join('/');
        paths.push(current_path);
    };

    paths.push("");

    return paths
}

export async function GetLayoutFile(pathname: string, page_root: string = `./src/pages`) {

    const layout_file = `layout.tsx`;

    if (pathname === "/") {
        try {
            if ((await fs.promises.stat(`${page_root}/${layout_file}`)).isFile()) {
                return `${page_root}/${layout_file}`
            }
        } catch (error) {
            console.log("ERROR: No layout.tsx file exists at root")
        }
    }

    const paths = GetPaths(pathname)

    for (const path of paths) {
        try {
            const fullPath = `${page_root}/${path ? '/' + path : ''}/${layout_file}`;
            const stats = await fs.promises.stat(fullPath);
            if (stats.isFile()) {
                return `${page_root}/${path}/${layout_file}`
            }
        } catch (error) {
            continue;
        }
    }

    return false
}

export async function HandleRoute(pathname: string) {
    try {

        console.log("REQ: ", pathname);

        // Import page based on url
        const page_file: RouteModule = await import(`./src/pages${pathname}/page.tsx`)
        const page_default = page_file.default;
        let html : string;
        let content = React.createElement(page_default);

        // Get highest level layout
        const layout_file_path = await GetLayoutFile(pathname);

        if (layout_file_path) {
            const layout_file: RouteModule = await import(layout_file_path);
            const page_layout = layout_file.default;
            let full_content = React.createElement(page_layout, null, content);
            html = renderToString(full_content);
        } else {
            html = renderToString(content);
        }

        return new Response(html, {
            headers: {
                'Content-Type': 'text/html'
            }
        })
        // Extract components
    }
    catch (error) {
        console.log("Routing error: ", error);
        return new Response("Page not found", { status: 404 })
    }
}