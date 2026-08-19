import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "v5.airtableusercontent.com",
      },
      {
        protocol: "https",
        hostname: "dl.airtable.com",
      },
      {
        protocol: "https",
        hostname: "attachments.airtableusercontent.com",
      },
    ],
  },

  /**
   * F05 C9 — this deployment is an archive, not a product.
   *
   * `X-Robots-Tag` on every response, alongside the `Disallow: /` in
   * `app/robots.ts`. The two do different jobs and neither replaces the other:
   * `robots.txt` asks a crawler not to fetch, this header tells one that
   * fetched anyway not to index, follow or cache. A URL already sitting in an
   * index is re-checked by fetching it — precisely the case where only the
   * header helps.
   *
   * `noarchive` matters more than it looks: without it a search engine may keep
   * serving a cached copy of a v1 job page — complete with its application
   * form — long after this deployment is eventually retired.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};

export default nextConfig;