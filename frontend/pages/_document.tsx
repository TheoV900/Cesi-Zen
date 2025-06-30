// frontend/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* 1) Charger Tailwind via CDN */}
        <script
          src="https://cdn.tailwindcss.com"
          // @ts-ignore
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      primary: { light: '#7C3AED', DEFAULT: '#5B21B6', dark: '#4C1D95' },
                      background: { light: '#F3F4F6', DEFAULT: '#FFFFFF', dark: '#1F2937' },
                      surface: { light: '#FFFFFF', dark: '#111827' },
                      text: { light: '#1F2937', dark: '#F9FAFB' },
                    }
                  }
                }
              };
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
