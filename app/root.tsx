import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { MyPokemonProvider } from "./context/MyPokemonContext";
import { ThemeProvider } from "./context/ThemeContext";
import TopBar from "./components/layout/TopBar";
import BottomNav from "./components/layout/BottomNav";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
   { rel: "icon", href: "/favicon.svg" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isApp = !isLandingPage;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          {isApp ? (
            <div className="phone-wrapper">
              <div className="phone-frame">
                {}
                {}

                <div className="phone-content">
                  <header className="phone-header">
                    <TopBar />
                  </header>

                  <main className="phone-main">
                    {children}
                  </main>

                  <footer className="phone-footer">
                    <BottomNav />
                  </footer>
                </div>
              </div>
            </div>
          ) : (
            <div className="phone-wrapper" style={{ background: '#091057' }}>
              <div className="phone-frame" style={{ background: '#091057' }}>
                {children}
              </div>
            </div>
          )}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MyPokemonProvider>
      <Outlet />
    </MyPokemonProvider>
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
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-content">
          <main className="phone-main pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
              <pre className="w-full p-4 overflow-x-auto">
                <code>{stack}</code>
              </pre>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
