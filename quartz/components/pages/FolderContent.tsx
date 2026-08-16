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
import { getSlideshowImages } from "../../util/slideshowImages"

interface FolderContentOptions {
  showFolderCount: false
  showSubfolders: false
  sort?: SortFn
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: false,
  showSubfolders: false,
}

// Helper function to safely extract and normalize tags
const getTagsArray = (frontmatter: any): string[] => {
  const tags = frontmatter?.tags;
  
  if (!tags) return [];
  
  // Handle different tag formats
  if (typeof tags === 'string') {
    // Handle comma-separated string or single tag
    return tags.split(',').map(tag => tag.trim().toLowerCase());
  }
  
  if (Array.isArray(tags)) {
    // Handle array of tags
    return tags.map(tag => String(tag).trim().toLowerCase()).filter(tag => tag.length > 0);
  }
  
  return [];
}

// Custom Art Gallery Component with Date Sorting, For-Sale, and Sold Functionality
const ArtGallery: QuartzComponent = ({ tree, fileData, allFiles, cfg, ctx, forceNoDescription }: QuartzComponentProps) => {
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
      <div class="art-gallery-container">
        {sortedPages.map((file, index) => {
          const title = file.frontmatter?.title ?? "Untitled"
          const socialImage = file.frontmatter?.socialImage
          const description = file.description || ""
          
          // Use robust tag checking
          const tagsArray = getTagsArray(file.frontmatter)
          
          // Check for sale status with case-insensitive matching
          const isForSale = tagsArray.includes('for-sale') || tagsArray.includes('forsale')
          const isSold = tagsArray.includes('sold')
          const isGift = tagsArray.includes('gift') && !isSold && !isForSale
          const isSlideshow = tagsArray.includes('slideshow')
          const slideshowImages = isSlideshow
            ? getSlideshowImages(ctx, file.slug ?? '', file.frontmatter?.images)
            : []

          let imageSrc = null
if (isSlideshow && slideshowImages.length > 0) {
  const firstImage = slideshowImages[0]
  imageSrc = firstImage.startsWith('http') ? firstImage : `/attachments/${firstImage}`
} else if (socialImage) {
  if (socialImage.startsWith('http')) {
    imageSrc = socialImage  // Direct URL - works for Cloudinary
  } else {
    imageSrc = `/attachments/${socialImage}`  // Local fallback
  }
}
          
          return (
            <div key={file.slug} className={`gallery-art-item ${isForSale ? 'for-sale' : ''} ${isSold ? 'sold' : ''} ${isGift ? 'gift' : ''} ${isSlideshow ? 'slideshow' : ''}`}>
              {imageSrc && (
                <div className="gallery-art-preview">
                  <a href={`/${file.slug}`} className="internal">
                    <img src={imageSrc} alt={title} loading="lazy" className="gallery-artwork-image" />
                    {isSold && (
                      <div className="gallery-sale-badge gallery-sold-badge">
                        Sold
                      </div>
                    )}
                    {isForSale && !isSold && (
                      <div className="gallery-sale-badge">
                        For Sale
                      </div>
                    )}
                    {isGift && (
                      <div className="gallery-sale-badge gallery-gift-badge">
                        Gift
                      </div>
                    )}
                    {isSlideshow && (
                      <div className="gallery-sale-badge gallery-slideshow-badge">
                        Slideshow
                      </div>
                    )}
                  </a>
                </div>
              )}
              <div className="gallery-art-details">
                <h3>
                  <a href={`/${file.slug}`} className="internal">
                    {title}
                  </a>
                </h3>
                {description && !isSlideshow && !forceNoDescription && (
                  <p className="gallery-art-description">{description}</p>
                )}
                {isSold && (
                  <div className="gallery-sale-info">
                    <span className="gallery-sold-status">Sold</span>
                  </div>
                )}
                {isForSale && !isSold && (
                  <div className="gallery-sale-info">
                    <span className="gallery-availability">Available</span>
                  </div>
                )}
                {isGift && (
                  <div className="gallery-sale-info">
                    <span className="gallery-gift-status">Gifted</span>
                  </div>
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
    
    // Use ArtGallery for my-art and my-photos folders, default for others
    if (slug === "my-art" || slug.startsWith("my-art/")) {
      return <ArtGallery {...props} />
    }
    if (slug === "my-photos" || slug.startsWith("my-photos/")) {
      return <ArtGallery {...props} forceNoDescription />
    }

    return <DefaultFolderContent {...props} />
  }
  
  const artGalleryStyles = `
    /* High specificity fixes for deployment CSS conflicts */
    .popover-hint .art-gallery-container .gallery-artwork-image,
    .art-gallery-container .gallery-artwork-image,
    .gallery-artwork-image {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      display: block !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      margin: 0 !important;
      padding: 0 !important;
      max-width: none !important;
      max-height: none !important;
      border: none !important;
      transition: transform 0.3s ease !important;
    }
    
    .art-gallery-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .gallery-art-item {
      border: 1px solid #d8d8da;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      background: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
    }
    
    /* Dark mode styles */
    :root[saved-theme="dark"] .gallery-art-item {
      border-color: #2a2a2b;
      background: #151515;
    }
    
    .gallery-art-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border-color: #185ecd;
    }
    
    :root[saved-theme="dark"] .gallery-art-item:hover {
      border-color: #6b8ce6;
    }
    
    .gallery-art-item.for-sale {
      border-color: #2563eb;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
    }
    
    .gallery-art-item.for-sale:hover {
      border-color: #1d4ed8;
      box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
    }
    
    .gallery-art-item.sold {
      border-color: #6b7280;
      box-shadow: 0 2px 8px rgba(107, 114, 128, 0.2);
      opacity: 0.8;
    }
    
    .gallery-art-item.sold:hover {
      border-color: #4b5563;
      box-shadow: 0 8px 25px rgba(107, 114, 128, 0.3);
    }

    .gallery-art-item.gift {
      border-color: #ec4899;
      box-shadow: 0 2px 8px rgba(236, 72, 153, 0.2);
    }

    .gallery-art-item.gift:hover {
      border-color: #db2777;
      box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
    }

    .gallery-art-item.slideshow {
      border-color: #8b5cf6;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
    }

    .gallery-art-item.slideshow:hover {
      border-color: #7c3aed;
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    }

    .gallery-art-preview {
      width: 100%;
      height: 220px;
      overflow: hidden;
      position: relative;
    }
    
    .gallery-art-preview a {
      display: block;
      width: 100%;
      height: 100%;
      text-decoration: none;
    }
    
    .gallery-art-item:hover .gallery-artwork-image {
      transform: scale(1.05) !important;
    }
    
    .gallery-sale-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #2563eb;
      color: white;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      z-index: 10;
    }
    
    .gallery-sold-badge {
      background: #6b7280 !important;
      color: white;
    }

    .gallery-gift-badge {
      background: #ec4899 !important;
      color: white;
    }

    .gallery-slideshow-badge {
      background: #8b5cf6 !important;
      color: white;
    }

    .gallery-art-details {
      padding: 1.25rem;
    }
    
    .gallery-art-details h3 {
      margin: 0 0 0.75rem 0;
      font-size: 1.2rem;
      line-height: 1.3;
    }
    
    .gallery-art-details h3 a {
      color: #202225;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    :root[saved-theme="dark"] .gallery-art-details h3 a {
      color: #ececec;
    }
    
    .gallery-art-details h3 a:hover {
      color: #185ecd;
    }
    
    :root[saved-theme="dark"] .gallery-art-details h3 a:hover {
      color: #6b8ce6;
    }
    
    .gallery-art-description {
      margin: 0 0 0.75rem 0;
      color: #868889;
      font-size: 0.9rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    :root[saved-theme="dark"] .gallery-art-description {
      color: #5f6062;
    }
    
    .gallery-sale-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.5rem;
      border-top: 1px solid #d8d8da;
    }
    
    :root[saved-theme="dark"] .gallery-sale-info {
      border-top-color: #2a2a2b;
    }
    
    .gallery-availability {
      font-size: 0.8rem;
      color: #059669;
      font-weight: 500;
      background: rgba(5, 150, 105, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
    }
    
    .gallery-sold-status {
      font-size: 0.8rem;
      color: #6b7280;
      font-weight: 500;
      background: rgba(107, 114, 128, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .gallery-gift-status {
      font-size: 0.8rem;
      color: #ec4899;
      font-weight: 500;
      background: rgba(236, 72, 153, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
    }

    @media (max-width: 600px) {
      .art-gallery-container {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-top: 1.5rem;
      }
      
      .gallery-art-preview {
        height: 200px;
      }
      
      .gallery-art-details {
        padding: 1rem;
      }
    }
  `
  
  FolderContent.css = concatenateResources(style, PageList.css, artGalleryStyles)
  return FolderContent
}) satisfies QuartzComponentConstructor