"use client";

import { useEffect } from 'react';

export const CursorManager = () => {
    useEffect(() => {
        const cursorUrl = "url('/images/ui/cursor.svg') 0 0, auto";

        const style = document.createElement('style');
        style.innerHTML = `
            * {
                cursor: ${cursorUrl} !important;
            }
            body, html, button, a, input, textarea, select, div, p, span, h1, h2, h3, h4, h5, h6 {
                cursor: ${cursorUrl} !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return null;
};
