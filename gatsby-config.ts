import type { GatsbyConfig } from "gatsby";
import adapter from "gatsby-adapter-netlify";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `gakumas-final-score`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [],
  adapter: adapter(),
};

export default config;
