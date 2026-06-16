import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://resourcesjs.amrachraf.cloud",
  integrations: [
    starlight({
      title: "ResourcesJS",
      description:
        "Laravel-inspired API Resources for Node.js and TypeScript.",
      logo: {
        src: "./src/assets/resourcesjs-logo.svg",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/amrachraf6699/resourcesjs",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/amrachraf6699/resourcesjs/edit/main/docs/",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Start Here",
          items: [
            { label: "Overview", link: "/" },
            "getting-started",
            "deployment",
          ],
        },
        {
          label: "Core Concepts",
          items: [
            "resources",
            "collections",
            "nested-resources",
            "conditional-fields",
            "metadata",
            "pagination",
          ],
        },
        {
          label: "Integrations",
          items: [
            "validation",
            "openapi",
            "standard-responses",
            "frameworks",
          ],
        },
        {
          label: "Reference",
          items: ["api-reference", "roadmap"],
        },
      ],
    }),
  ],
});
