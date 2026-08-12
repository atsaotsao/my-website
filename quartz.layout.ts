import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
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
  Component.MobileNavToggle(),
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
      { name: "my playlists", url: "/my-playlists" },
      { name: "wander", url: "/explore" },
    ]
  }),
]

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
    Component.PhotoCarousel(),
  ],
  left: sharedSidebar,
  right: [],
  afterBody: [
    Component.ArtworkDetails(), // Add this line
    Component.PostInteractions(),  // ← ADD THIS
    Component.AdjacentPosts(),
    Component.ExploreGraph(),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.Spacer(),
    Component.ArticleTitle(),
  ],
  left: sharedSidebar,
  right: [],
  afterBody: [],
  pageBody: Component.FolderContent(),
}
