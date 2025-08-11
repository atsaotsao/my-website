// quartz.config.ts
import type { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    // Link to your Obsidian folder via symlink
    // ln -s "/Users/andrewtsao/Library/Mobile Documents/iCloud~md~obsidian/Documents/True_Bro/🌞 My Website" ~/Sites/quartz-content
    contentDir: "/Users/andrewtsao/Sites/quartz-content",

    pageTitle: "Andrew Tsao",
    pageTitleSuffix: "",
    baseUrl: "localhost",
    locale: "en-US",
    enableSPA: true,
    enablePopovers: true,
    analytics: { provider: "plausible" },

    ignorePatterns: [
      "**/.obsidian/**",
      "**/.git/**",
      "**/node_modules/**",
      "**/.DS_Store",
      "**/Archive/**",
      "**/Templates/**",
      "**/template/**",
      "**/Private/**",
      "**/private/**",
      "**/Trash/**",
      "**/*.trash/**",
      "**/Untitled/**",
      "**/Attachments/**",
      "**/assets/**",
    ],

    defaultDateType: "modified",

    // Theme — system fonts + “van” palette
    theme: {
      fontOrigin: "system",
      cdnCaching: true,
      typography: {
        header:
          "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif",
        body:
          "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif",
        code:
          "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
      },
      colors: {
        lightMode: {
          light: "#f7f8fa",
          lightgray: "#f2f3f5",
          gray: "#c8c9cc",
          darkgray: "#646566",
          dark: "#323233",
          secondary: "#1989fa",
          tertiary: "#07c160",
          highlight: "rgba(25, 137, 250, 0.08)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#151515",
          lightgray: "#2a2a2b",
          gray: "#5f6062",
          darkgray: "#d4d4d4",
          dark: "#ececec",
          secondary: "#5aa7ff",
          tertiary: "#35d07f",
          highlight: "rgba(90, 167, 255, 0.12)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },

  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["git", "filesystem", "frontmatter"],
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents({ maxDepth: 3 }),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.Latex({ renderEngine: "katex" }),
    ],

    // Require `publish: true` in frontmatter
    filters: [],

    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
