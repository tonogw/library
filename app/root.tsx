import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";

import type { Route } from "./+types/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider } from "react-redux";
// import {Quicksand} from "../app/app.css"
import { store } from "~/store";
import { Toaster } from "sonner";

import "./app.css";

// const quicksand = Quicksand({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700', '800'],
//   style: ['normal', 'italic'],
//   variable: '--font-poppins',
// });

// 1. Layout hanya bertugas menyusun dokumen HTML dasar murni
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// 2. Di sini tempat terbaik membungkus Provider agar tidak merender ganda!
export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="min-h-screen bg-white font-quicksand">
      <main className="mx-auto max-w-[1440px] px-6 py-20 lg:px-[120px]">
        <div className="rounded-2xl p-8 text-center shadow-xs">
          <h1 className="text-48 m-0 mb-2 font-extrabold text-[#EE1D52]">
            {message}
          </h1>
          <h2 className="text-18 mb-4 font-bold text-[#0A0D12]">
            Aplikasi Mengalami Kendala
          </h2>
          <p className="text-14 mb-6 leading-relaxed font-medium text-[#414651]">
            {details}
          </p>

          {stack && (
            <pre className="text-12 w-full overflow-x-auto rounded-xl bg-gray-900 p-4 text-left font-mono leading-normal text-red-400">
              <code>{stack}</code>
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}
