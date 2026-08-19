import fs from "fs"
import path from "path"
import { BuildCtx } from "./ctx"
import { slugifyFilePath, FilePath } from "./path"

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"])

function readImagesFromFolder(ctx: BuildCtx, folderName: string): string[] {
  const folderPath = path.join(ctx.argv.directory, "attachments", folderName)
  try {
    const entries = fs.readdirSync(folderPath)
    return entries
      .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      // Quartz's asset emitter slugifies the whole relative path (folder
      // included) when copying to public/, e.g. "08.05 - 08.16/foo.jpg" ->
      // "08.05---08.16/foo.jpg". Slugify the real filename+folder together
      // (not the folder alone) so a "." in the folder name isn't mistaken
      // for a file extension.
      .map((f) => slugifyFilePath(`${folderName}/${f}` as FilePath))
  } catch {
    return []
  }
}

// Looks for a folder in attachments/ named after the note and returns every
// image inside it, sorted by filename. Tries the note's real title first
// (e.g. "08.05 - 08.16", matching what someone naturally names a folder in
// Obsidian/Finder), then the URL-slugified basename as a fallback (e.g.
// "the-art-of-surrender", for folders that were named to match the slug
// directly). Falls back to an explicit `images:` frontmatter list if
// neither folder exists, so older pages keep working without a folder.
export function getSlideshowImages(
  ctx: BuildCtx,
  slug: string,
  title?: string,
  explicitImages?: string[],
): string[] {
  const slugBasename = slug.split("/").pop() ?? slug
  const candidates = [title, slugBasename].filter((c): c is string => !!c)

  for (const candidate of candidates) {
    const images = readImagesFromFolder(ctx, candidate)
    if (images.length > 0) {
      return images
    }
  }

  return explicitImages ?? []
}
