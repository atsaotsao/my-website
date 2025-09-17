import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

// Debug version with for-sale functionality
const ArtGallery: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
  const slug = fileData.slug!
  
  console.log("=== ArtGallery Debug ===")
  console.log("Current slug:", slug)
  
  const allPagesInFolder = allFiles.filter((file) => {
    const fileSlug = file.slug ?? ""
    const prefixed = fileSlug.startsWith(slug) && fileSlug !== slug
    const folderPart = fileSlug.slice(slug.length + 1)
    return prefixed && !folderPart.includes("/")
  })
  
  console.log("Pages in folder:", allPagesInFolder.length)
  
  // Debug each file's frontmatter
  allPagesInFolder.forEach((file, index) => {
    console.log(`File ${index + 1}:`, {
      slug: file.slug,
      title: file.frontmatter?.title,
      socialImage: file.frontmatter?.socialImage,
      tags: file.frontmatter?.tags,
      price: file.frontmatter?.price,
      frontmatter: file.frontmatter
    })
  })
  
  const content = fileData.description?.trim() || "No folder description"
  
  return (
    <div className="folder-container">
      <article>
        <p>{content}</p>
      </article>
      
      {/* Debug info panel */}
      <div className="debug-panel" style={{ 
        background: '#f0f0f0', 
        padding: '1rem', 
        margin: '1rem 0', 
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '0.8rem'
      }}>
        <strong>Debug Info:</strong><br/>
        Current slug: {slug}<br/>
        Files found: {allPagesInFolder.length}<br/>
        {allPagesInFolder.map((file, i) => (
          <div key={i}>
            File {i + 1}: {file.slug}<br/>
            - Title: {file.frontmatter?.title || 'No title'}<br/>
            - socialImage: {file.frontmatter?.socialImage || 'No socialImage'}<br/>
            - Tags: {JSON.stringify(file.frontmatter?.tags)}<br/>
            - Price: {file.frontmatter?.price || 'No price'}<br/>
          </div>
        ))}
      </div>
      
      <div className="art-gallery">
        {allPagesInFolder.map((file) => {
          const title = file.frontmatter?.title ?? "Untitled"
          const socialImage = file.frontmatter?.socialImage
          const description = file.description || ""
          
          // Check if item is for sale
          const isForSale = file.frontmatter?.tags?.includes('for-sale')
          const price = file.frontmatter?.price
          
          // Debug image path resolution
          let imageSrc = null
          let debugPath = "No socialImage"
          
          if (socialImage) {
            // Remove any extra quotes that might be in the frontmatter
            const cleanImage = socialImage.replace(/^["']|["']$/g, '')
            
            debugPath = `Original: ${socialImage}, Cleaned: ${cleanImage}`
            
            if (cleanImage.startsWith('http')) {
              imageSrc = cleanImage
            } else if (cleanImage.startsWith('attachments/')) {
              imageSrc = `/${cleanImage}`
            } else if (!cleanImage.startsWith('/')) {
              // For filenames with spaces, we need to URL encode them properly
              const encodedFilename = encodeURIComponent(cleanImage)
              imageSrc = `/attachments/${encodedFilename}`
              
              // Also try the original filename as-is (in case the server handles spaces)
              if (!imageSrc.includes('%20')) {
                debugPath += `, Also trying: /attachments/${cleanImage}`
              }
            } else {
              imageSrc = cleanImage
            }
            
            debugPath += `, Final: ${imageSrc}`
          }
          
          return (
            <div key={file.slug} className={`art-item ${isForSale ? 'for-sale' : ''}`}>
              {/* Debug info for each item */}
              <div className="item-debug" style={{
                background: '#e0e0e0',
                padding: '0.5rem',
                fontSize: '0.7rem',
                fontFamily: 'monospace'
              }}>
                <strong>Debug:</strong><br/>
                {debugPath}<br/>
                For Sale: {isForSale ? 'YES' : 'NO'}<br/>
                Price: {price || 'N/A'}<br/>
                Image exists check: <img 
                  src={imageSrc || ''} 
                  alt="test" 
                  style={{width: '20px', height: '20px', display: 'inline'}}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.border = '1px solid red'
                    console.log('Image failed to load:', imageSrc)
                  }}
                  onLoad={() => console.log('Image loaded successfully:', imageSrc)}
                />
              </div>
              
              {imageSrc && (
                <div className="art-preview">
                  <a href={`/${file.slug}`} className="internal">
                    <img 
                      src={imageSrc} 
                      alt={title} 
                      loading="lazy"
                      onError={(e) => {
                        console.log('Preview image failed to load:', imageSrc)
                        ;(e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                    {isForSale && (
                      <div className="sale-badge">
                        {price ? `$${price}` : 'For Sale'}
                      </div>
                    )}
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
                {isForSale && (
                  <div className="sale-info">
                    {price && <span className="price">${price}</span>}
                    <span className="availability">Available</span>
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

// Default folder listing component
const DefaultFolderContent: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
  const slug = fileData.slug!
  
  const allPagesInFolder = allFiles.filter((file) => {
    const fileSlug = file.slug ?? ""
    const prefixed = fileSlug.startsWith(slug) && fileSlug !== slug
    const folderPart = fileSlug.slice(slug.length + 1)
    return prefixed && !folderPart.includes("/")
  })
  
  const content = fileData.description?.trim() || "No folder description"
  
  return (
    <div className="folder-container">
      <article>
        <p>{content}</p>
      </article>
      <div className="folder-list">
        {allPagesInFolder.map((file) => {
          const title = file.frontmatter?.title ?? "Untitled"
          const description = file.description || ""
          
          return (
            <div key={file.slug} className="folder-item">
              <h3>
                <a href={`/${file.slug}`} className="internal">
                  {title}
                </a>
              </h3>
              {description && <p>{description}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Main conditional component  
const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData } = props
  const slug = fileData.slug!
  
  // Use ArtGallery for my-art folder, default for others
  if (slug === "my-art" || slug.startsWith("my-art/")) {
    return <ArtGallery {...props} />
  }
  
  return <DefaultFolderContent {...props} />
}

FolderContent.css = `
.folder-container {
  max-width: 100%;
}

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
  position: relative;
}

.art-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-color: var(--secondary);
}

.art-item.for-sale {
  border-color: #2563eb;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.art-item.for-sale:hover {
  border-color: #1d4ed8;
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
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

.sale-badge {
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
  margin: 0 0 0.75rem 0;
  color: var(--gray);
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sale-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
}

.price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2563eb;
}

.availability {
  font-size: 0.8rem;
  color: #059669;
  font-weight: 500;
  background: rgba(5, 150, 105, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Default Folder List Styles */
.folder-list {
  margin-top: 1.5rem;
}

.folder-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.folder-item:last-child {
  border-bottom: none;
}

.folder-item h3 {
  margin: 0 0 0.5rem 0;
}

.folder-item h3 a {
  color: var(--dark);
  text-decoration: none;
}

.folder-item h3 a:hover {
  color: var(--secondary);
}

.folder-item p {
  margin: 0;
  color: var(--gray);
  font-size: 0.9rem;
  line-height: 1.4;
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

export default (() => FolderContent) satisfies QuartzComponentConstructor