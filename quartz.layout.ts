// quartz.layout.ts - Updated with "my playlist" navigation
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Sunlit(),
  ],
  footer: Component.Footer({
    links: {},
  }),
}

const sharedSidebar = [
  Component.PageTitle(),
  Component.MobileOnly(Component.Spacer()),
  Component.Flex({
    components: [
      {
        Component: Component.Search(),
        grow: true,
      },
      { Component: Component.Darkmode() },
    ],
  }),
  Component.CustomNav({
    links: [
      { name: "now", url: "/now" },
      { name: "principles", url: "/principles" },
      { name: "coaching", url: "/coaching" },
      { name: "my writing", url: "/my-writing" },
      { name: "my art", url: "/my-art" },
      { name: "my playlists", url: "/my-playlists" }, // Changed from "/my-playlist"
    ]
  }),
];

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.Spacer(),
    Component.ArticleTitle(),
    Component.ContentMeta({
      showReadingTime: false,
      showComma: false,
    }),
    Component.TagList(),
  ],
  left: sharedSidebar,
  right: [],
  afterBody: [],
}

// In your quartz.layout.ts file, update your defaultListPageLayout:

export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(), 
    Component.ArticleTitle(),
  ],
  left: sharedSidebar,
  right: [],
  afterBody: [
    Component.FolderContent({
      showFolderCount: false,
      showSubfolders: false,
    }),
  ],
}