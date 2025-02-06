// src/layouts/RootLayout.tsx
import React from 'react';
import "../pages/style.css";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html>
            <head>
                <title>Novel Website</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
                <div id="root">
                    Root Layout
                    {children}
                </div>
            </body>
        </html>
    );
}