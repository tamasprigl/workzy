import type { MetadataRoute } from "next";

/**
 * Workzy v1 is an archive. Keep it out of every index (F05 C9).
 *
 * ## Why this appeared only now
 *
 * v1 had **no** `robots.txt` at all — `/robots.txt` returned a 404 HTML page —
 * and no `noindex` anywhere. That was harmless while v1 *was* the product on
 * `www.workzy.hu`. It stopped being harmless the moment `www.workzy.hu` moved
 * to v2 on 2026-08-19 and this deployment stayed publicly reachable at
 * `workzy.vercel.app` still serving the same nine job adverts.
 *
 * Left alone, a search engine could keep the legacy host in its index and route
 * real candidates to a system whose applications no longer reach any employer.
 * The write paths are now closed, so nothing would be lost — but the candidate
 * would still be applying into a dead end, and believing otherwise.
 *
 * ## Disallow, deliberately, and not `noindex` alone
 *
 * `Disallow: /` asks crawlers not to fetch. The `X-Robots-Tag:
 * noindex, nofollow, noarchive` header in `next.config.ts` asks them not to
 * index, follow or cache what they do fetch. Neither is redundant: a page
 * already in an index is re-evaluated on fetch, and a page never fetched cannot
 * be de-indexed by a header it never sees. Both are set.
 *
 * ## What is deliberately NOT done
 *
 * The site is not redirected to v2 and nothing is taken down. C9 requires this
 * deployment to remain **readable** as the evidence base for every
 * post-cutover question, until the agreed retention end
 * `2026-09-18T09:46:18.647655Z`. Blocking crawlers is not the same as blocking
 * people, and only the first is wanted here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
