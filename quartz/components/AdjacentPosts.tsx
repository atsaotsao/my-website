import { resolveRelative, FullSlug } from "../util/path"
import { byDateAndAlphabetical } from "./PageList"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const NAV_FOLDERS = ["my-writing", "my-art", "my-playlists"]

const AdjacentPosts: QuartzComponent = ({ fileData, allFiles, cfg }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  const slugParts = slug.split("/")
  const folder = slugParts.slice(0, -1).join("/")

  if (!NAV_FOLDERS.includes(folder)) {
    return null
  }

  const siblings = allFiles
    .filter((f) => {
      const fParts = (f.slug ?? "").split("/")
      return fParts.slice(0, -1).join("/") === folder && fParts[fParts.length - 1] !== "index"
    })
    .sort(byDateAndAlphabetical(cfg))

  const currentIndex = siblings.findIndex((f) => f.slug === slug)
  if (currentIndex === -1) {
    return null
  }

  // list is newest-first, like the folder listing pages: "newer" is up (index - 1), "older" is down (index + 1)
  const newer = currentIndex > 0 ? siblings[currentIndex - 1] : null
  const older = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null

  if (!newer && !older) {
    return null
  }

  return (
    <div class="adjacent-posts">
      {newer && (
        <a href={resolveRelative(fileData.slug!, newer.slug!)} class="internal adjacent-post">
          <span class="adjacent-arrow">←</span>
          <span class="adjacent-title">{newer.frontmatter?.title}</span>
        </a>
      )}
      {older && (
        <a href={resolveRelative(fileData.slug!, older.slug!)} class="internal adjacent-post">
          <span class="adjacent-title">{older.frontmatter?.title}</span>
          <span class="adjacent-arrow">→</span>
        </a>
      )}
    </div>
  )
}

AdjacentPosts.css = `
  .adjacent-posts {
    display: flex;
    justify-content: center;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 2rem;
    margin: 2.5rem 0 1.5rem 0;
    padding-top: 1.5rem;
    border-top: 1px solid var(--lightgray);
    text-align: center;
  }

  .adjacent-post {
    display: inline-flex;
    align-items: baseline;
    gap: 0.4rem;
    text-decoration: none;
    color: var(--secondary);
    font-weight: 500;
    max-width: 100%;
  }

  .adjacent-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .adjacent-post:hover .adjacent-title {
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    .adjacent-title {
      white-space: normal;
    }
  }
`

export default (() => AdjacentPosts) satisfies QuartzComponentConstructor
