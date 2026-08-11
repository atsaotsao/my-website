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
      <div class="adjacent-post adjacent-newer">
        {newer && (
          <a href={resolveRelative(fileData.slug!, newer.slug!)} class="internal">
            <span class="adjacent-label">← Newer</span>
            <span class="adjacent-title">{newer.frontmatter?.title}</span>
          </a>
        )}
      </div>
      <div class="adjacent-post adjacent-older">
        {older && (
          <a href={resolveRelative(fileData.slug!, older.slug!)} class="internal">
            <span class="adjacent-label">Older →</span>
            <span class="adjacent-title">{older.frontmatter?.title}</span>
          </a>
        )}
      </div>
    </div>
  )
}

AdjacentPosts.css = `
  .adjacent-posts {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    margin: 2.5rem 0 1.5rem 0;
    padding-top: 1.5rem;
    border-top: 1px solid var(--lightgray);
  }

  .adjacent-post {
    flex: 1 1 0;
    min-width: 0;
  }

  .adjacent-post.adjacent-older {
    text-align: right;
  }

  .adjacent-post a {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-decoration: none;
    color: var(--dark);
  }

  .adjacent-post.adjacent-older a {
    align-items: flex-end;
  }

  .adjacent-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--gray);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .adjacent-title {
    font-weight: 500;
    color: var(--secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .adjacent-post a:hover .adjacent-title {
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    .adjacent-title {
      white-space: normal;
    }
  }
`

export default (() => AdjacentPosts) satisfies QuartzComponentConstructor
