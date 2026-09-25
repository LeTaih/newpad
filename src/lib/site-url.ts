if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  // Module-level so this fires once per build, not once per import.
  console.warn(
    "site-url: NEXT_PUBLIC_SITE_URL is unset in a production build — falling back to http://localhost:4173. " +
      "Absolute URLs (metadataBase, Open Graph, canonical) will be wrong unless this is a local test build.",
  );
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4173").replace(/\/$/, "");
