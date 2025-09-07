import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const ArtGallery: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
  const slug = fileData.slug!
  console.log("=== ArtGallery Debug ===")
  console.log("Current slug:", slug)
  console.log("Total files:", allFiles.length)
  
  // Show all files that start with "my-art"
  const artFiles = allFiles.filter(f => f.slug?.includes("my-art"))
  console.log("Files containing 'my-art':", artFiles.map(f => f.slug))
  
  const allPagesInFolder = allFiles.filter((file) => {
    const fileSlug = file.slug ?? ""
    const prefixed = fileSlug.startsWith(slug) && fileSlug !== slug
    const folderPart = fileSlug.slice(slug.length + 1)
    const result = prefixed && !folderPart.includes("/")
    
    if (fileSlug.includes("my-art")) {
      console.log(`Testing: ${fileSlug}`)
      console.log(`  starts with '${slug}':`, fileSlug.startsWith(slug))
      console.log(`  not equal to '${slug}':`, fileSlug !== slug)
      console.log(`  folder part: '${folderPart}'`)
      console.log(`  no slash in folder part:`, !folderPart.includes("/"))
      console.log(`  final result:`, result)
    }
    
    return result
  })
  
  console.log("Final pages in folder:", allPagesInFolder.length)
  console.log("=== End Debug ===")
  
  const content = fileData.description?.trim() || "No folder description"
  
  return (
    <div className="folder-container">
      <article>
        <p>{content}</p>
      </article>
      <div className="art-gallery">
        {allPagesInFolder.map((file) => {
          const title = file.frontmatter?.title ?? "Untitled"
          const socialImage = file.frontmatter?.socialImage
          
          return (
            <div key={file.slug} className="art-item">
              {socialImage && (
                <div className="art-preview">
                  <img src={socialImage} alt={title} />
                </div>
              )}
              <div className="art-details">
                <h3>
                  <a href={`/${file.slug}`} className="internal">
                    {title}
                  </a>
                </h3>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

ArtGallery.css = `
.art-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.art-item {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}
.art-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.art-preview {
  width: 100%;
  height: 200px;
  overflow: hidden;
}
.art-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.art-details {
  padding: 1rem;
}
.art-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}
`

export default (() => ArtGallery) satisfies QuartzComponentConstructor