import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  trailingSlash: true,
  outputFileTracingIncludes: { "/*": ["./data/imported-jobs.json", "./public/images/jobs/**/*"] },
};

export default withNextIntl(nextConfig);
