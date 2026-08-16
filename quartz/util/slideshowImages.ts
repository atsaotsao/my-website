import fs from "fs"
import path from "path"
import { BuildCtx } from "./ctx"

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"])

// Looks for a folder named after the note (attachments/<note-slug-basename>/)
// and returns every image inside it, sorted by filename. Falls back to an
// explicit `images:` frontmatter list if the folder doesn't exist, so
// existing pages keep working without a folder.
export function getSlideshowImages(ctx: BuildCtx, slug: string, explicitImages?: string[]): string[] {
  const basename = slug.split("/").pop() ?? slug
  const folderPath = path.join(ctx.argv.directory, "attachments", basename)

  try {
    const entries = fs.readdirSync(folderPath)
    const images = entries
      .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `${basename}/${f}`)
    if (images.length > 0) {
      return images
    }
  } catch {
    // folder doesn't exist, fall through to explicit list
  }

  return explicitImages ?? []
}
