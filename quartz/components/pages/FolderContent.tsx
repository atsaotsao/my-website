import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { QuartzPluginData } from "../../plugins/vfile"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { trieFromAllFiles } from "../../util/ctx"

interface FolderContentOptions {
  showFolderCount: false
  showSubfolders: false
  sort?: SortFn
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: false,
  showSubfolders: false,
}

// Custom Art Gallery Component with Date Sorting
const ArtGallery: QuartzComponent = ({ tree, fileData, allFiles, cfg, ctx }: QuartzComponentProps) => {
  const trie = (ctx.trie ??= trieFromAllFiles(allFiles))
  const folder = trie.findNode(fileData.slug!.split("/"))
  
  if (!folder) {
    return null
  }
  
  const allPagesInFolder: QuartzPluginData[] =
    folder.children
      .map((node) => node.data)
      .filter((page) => page !== undefined) ?? []
  
  // Sort by published date (newest first), then by created date, then alphabetically
  const sortedPages = allPagesInFolder.sort((a, b) => {
    if (a.dates?.published && b.dates?.published) {
      return b.dates.published.getTime() - a.dates.published.getTime()
    }
    if (a.dates?.created && b.dates?.created) {
      return b.dates.created.getTime() - a.dates.created.getTime()
    }
    const aTitle = a.frontmatter?.title ?? ""
    const bTitle = b.frontmatter?.title ?? ""
    return aTitle.localeCompare(bTitle)
  })
  
  const content = (
    (tree as Root).children.length === 0
      ? fileData.description
      : htmlToJsx(fileData.filePath!, tree)
  ) as ComponentChildren
  
  return (
    <div class="popover-hint">
      <article>{content}</article>
      <div class="art-gallery">
        {sortedPages.map((file) => {
          const title = file.frontmatter?.title ?? "Untitled"
          const socialImage = file.frontmatter?.socialImage
          const description = file.description || ""
          
          let imageSrc = null
          if (socialImage) {
            const cleanImage = socialImage.replace(/^["']|["']$/g, '')
            
            if (cleanImage.startsWith('http')) {
              imageSrc = cleanImage
            } else if (cleanImage.startsWith('attachments/')) {
              imageSrc = `/${cleanImage}`
            } else if (!cleanImage.startsWith('/')) {
              imageSrc = `/attachments/${cleanImage}`
            } else {
              imageSrc = cleanImage
            }
          }
          
          return (
            <div key={file.slug} className="art-item">
              {imageSrc && (
                <div className="art-preview">
                  <a href={`/${file.slug}`} className="internal">
                    <img src={imageSrc} alt={title} loading="lazy" />
                  </a>
                </div>
              )}
              <div className="art-details">
                <h3>
                  <a href={`/${file.slug}`} className="internal">
                    {title}
                  </a>
                </h3>
                {description && (
                  <p className="art-description">{description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Default Folder Component (using Quartz's PageList)
const DefaultFolderContent: QuartzComponent = (props: QuartzComponentProps) => {
  const { tree, fileData, allFiles, cfg, ctx } = props
  const trie = (ctx.trie ??= trieFromAllFiles(allFiles))
  const folder = trie.findNode(fileData.slug!.split("/"))
  
  if (!folder) {
    return null
  }
  
  const allPagesInFolder: QuartzPluginData[] =
    folder.children
      .map((node) => {
        if (node.data) {
          return node.data
        }
        if (node.isFolder) {
          const getMostRecentDates = (): QuartzPluginData["dates"] => {
            let maybeDates: QuartzPluginData["dates"] | undefined = undefined
            for (const child of node.children) {
              if (child.data?.dates) {
                if (!maybeDates) {
                  maybeDates = { ...child.data.dates }
                } else {
                  if (child.data.dates.created > maybeDates.created) {
                    maybeDates.created = child.data.dates.created
                  }
                  if (child.data.dates.modified > maybeDates.modified) {
                    maybeDates.modified = child.data.dates.modified
                  }
                  if (child.data.dates.published > maybeDates.published) {
                    maybeDates.published = child.data.dates.published
                  }
                }
              }
            }
            return (
              maybeDates ?? {
                created: new Date(),
                modified: new Date(),
                published: new Date(),
              }
            )
          }
          return {
            slug: node.slug,
            dates: getMostRecentDates(),
            frontmatter: {
              title: node.displayName,
              tags: [],
            },
          }
        }
      })
      .filter((page) => page !== undefined) ?? []
      
  const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
  const classes = cssClasses.join(" ")
  const listProps = {
    ...props,
    allFiles: allPagesInFolder,
  }
  
  const content = (
    (tree as Root).children.length === 0
      ? fileData.description
      : htmlToJsx(fileData.filePath!, tree)
  ) as ComponentChildren
  
  return (
    <div class="popover-hint">
      <article class={classes}>{content}</article>
      <div class="page-listing">
        <div>
          <PageList {...listProps} />
        </div>
      </div>
    </div>
  )
}

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts }
  
  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData } = props
    const slug = fileData.slug!
    
    // Use ArtGallery for my-art folder, default for others
    if (slug === "my-art" || slug.startsWith("my-art/")) {
      return <ArtGallery {...props} />
    }
    
    return <DefaultFolderContent {...props} />
  }
  
  const artGalleryStyles = `
    .art-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .art-item {
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      background: var(--bg);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .art-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border-color: var(--secondary);
    }
    
    .art-preview {
      width: 100%;
      height: 220px;
      overflow: hidden;
      position: relative;
    }
    
    .art-preview a {
      display: block;
      width: 100%;
      height: 100%;
      text-decoration: none;
    }
    
    .art-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .art-item:hover .art-preview img {
      transform: scale(1.05);
    }
    
    .art-details {
      padding: 1.25rem;
    }
    
    .art-details h3 {
      margin: 0 0 0.75rem 0;
      font-size: 1.2rem;
      line-height: 1.3;
    }
    
    .art-details h3 a {
      color: var(--dark);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .art-details h3 a:hover {
      color: var(--secondary);
    }
    
    .art-description {
      margin: 0;
      color: var(--gray);
      font-size: 0.9rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    @media (max-width: 600px) {
      .art-gallery {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-top: 1.5rem;
      }
      
      .art-preview {
        height: 200px;
      }
      
      .art-details {
        padding: 1rem;
      }
    }
  `
  
  FolderContent.css = concatenateResources(style, PageList.css, artGalleryStyles)
  return FolderContent
}) satisfies QuartzComponentConstructor