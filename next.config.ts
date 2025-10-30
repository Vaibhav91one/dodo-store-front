import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import lingoCompiler from "lingo.dev/compiler";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  webpack: (config, { dev }) => {
    // Ignore Lingo output during dev to reduce watcher load and avoid EMFILE
    if (dev) {
      const existingIgnored = (() => {
        const ig = (config.watchOptions as any)?.ignored;
        if (Array.isArray(ig)) return ig;
        if (typeof ig === "string") return [ig];
        return [] as string[];
      })();

      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: ["**/src/app/lingo/**", ...existingIgnored],
      } as any;
    }
    return config;
  },
};

// Initialize Lingo.dev Compiler for Next.js (App Router under src/app)
// Disable in dev or when LINGO_DISABLE=1 to avoid network/API requirements
const disableLingo = process.env.LINGO_DISABLE === "1" || process.env.NODE_ENV !== "production";

const withLingo = disableLingo
  ? ((cfg: NextConfig) => cfg)
  : lingoCompiler.next({
      sourceRoot: "src/app",
      lingoDir: "lingo",
      sourceLocale: "en",
      targetLocales: [
        "ar",
        "ca",
        "de",
        "zh",
        "es",
        "fr",
        "he",
        "it",
        "ja",
        "nl",
        "pl",
        "pt",
        "sv",
        "tr",
      ],
      rsc: true,
      useDirective: false,
      debug: false,
      models: {
        "*:*": "openrouter:openai/gpt-4.1-mini",
      },
    });

// Only apply Sentry configuration if environment variables are present
let config = withLingo(nextConfig);

if (process.env.NEXT_PUBLIC_SENTRY_PROJECT_NAME) {
  try {
    // Dynamic import for Sentry to avoid linter issues

    config = withSentryConfig(config, {
      // For all available options, see:
      // https://www.npmjs.com/package/@sentry/webpack-plugin#options

      org: "dodo-payments",
      project: process.env.NEXT_PUBLIC_SENTRY_PROJECT_NAME,

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Automatically annotate React components to show their full name in breadcrumbs and session replay
      reactComponentAnnotation: {
        enabled: true,
      },

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      tunnelRoute: "/monitoring",

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    });
  } catch (error) {
    console.warn("Sentry configuration failed:", error);
  }
}

export default config;
