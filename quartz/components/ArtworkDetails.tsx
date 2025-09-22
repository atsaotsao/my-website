import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { QuartzPluginData } from "../../plugins/vfile"

// Artwork Details Component
const ArtworkDetails: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const frontmatter = fileData.frontmatter
  
  // Check if this is an artwork page (has art-related frontmatter)
  const isArtwork = frontmatter?.medium || frontmatter?.dimensions || frontmatter?.price
  
  if (!isArtwork) {
    return null
  }
  
  // Extract artwork data
  const medium = frontmatter?.medium
  const dimensions = frontmatter?.dimensions
  const year = frontmatter?.year
  const price = frontmatter?.price
  const currency = frontmatter?.currency || "USD"
  const series = frontmatter?.series
  const surface = frontmatter?.surface
  const signed = frontmatter?.signed
  const framed = frontmatter?.framed
  const certificate = frontmatter?.certificate
  const location = frontmatter?.location
  const exhibitions = frontmatter?.exhibitions
  const soldDate = frontmatter?.soldDate
  const buyLink = frontmatter?.buyLink
  
  // Determine status
  const tags = frontmatter?.tags || []
  const isSold = tags.includes('sold') || soldDate
  const isForSale = tags.includes('for-sale') && !isSold
  
  return (
    <div className="artwork-details">
      <div className="artwork-meta-grid">
        {/* Primary Details */}
        <div className="meta-section primary-details">
          {medium && (
            <div className="meta-item">
              <span className="meta-label">Medium</span>
              <span className="meta-value">{medium}</span>
            </div>
          )}
          
          {dimensions && (
            <div className="meta-item">
              <span className="meta-label">Dimensions</span>
              <span className="meta-value">{dimensions}</span>
            </div>
          )}
          
          {year && (
            <div className="meta-item">
              <span className="meta-label">Year</span>
              <span className="meta-value">{year}</span>
            </div>
          )}
          
          {series && (
            <div className="meta-item">
              <span className="meta-label">Series</span>
              <span className="meta-value">{series}</span>
            </div>
          )}
        </div>
        
        {/* Additional Details */}
        {(surface || signed || framed || certificate) && (
          <div className="meta-section additional-details">
            {surface && (
              <div className="meta-item">
                <span className="meta-label">Surface</span>
                <span className="meta-value">{surface}</span>
              </div>
            )}
            
            <div className="features-row">
              {signed && <span className="feature-badge">Signed</span>}
              {framed && <span className="feature-badge">Framed</span>}
              {certificate && <span className="feature-badge">Certificate of Authenticity</span>}
            </div>
          </div>
        )}
        
        {/* Exhibition History */}
        {exhibitions && exhibitions.length > 0 && (
          <div className="meta-section exhibition-details">
            <div className="meta-item">
              <span className="meta-label">Exhibitions</span>
              <div className="meta-value exhibition-list">
                {exhibitions.map((exhibition: string, index: number) => (
                  <span key={index} className="exhibition-item">{exhibition}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Pricing and Availability */}
        <div className="meta-section pricing-section">
          {isSold ? (
            <div className="status-display sold-status">
              <span className="status-label">Status</span>
              <span className="status-value sold">Sold</span>
              {soldDate && (
                <span className="sold-date">Sold {new Date(soldDate).getFullYear()}</span>
              )}
            </div>
          ) : isForSale ? (
            <div className="status-display available-status">
              <span className="status-label">Status</span>
              <span className="status-value available">Available for Purchase</span>
              {price && (
                <div className="price-display">
                  <span className="price-amount">${price} {currency}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="status-display display-only">
              <span className="status-label">Status</span>
              <span className="status-value">Display Only</span>
            </div>
          )}
          
          {/* Buy Button */}
          {isForSale && buyLink && (
            <div className="buy-action">
              <a href={buyLink} className="buy-button" target="_blank" rel="noopener noreferrer">
                Purchase Artwork
              </a>
              <p className="purchase-note">Shipping and handling calculated at checkout</p>
            </div>
          )}
        </div>
        
        {/* Location */}
        {location && (
          <div className="meta-section location-details">
            <div className="meta-item">
              <span className="meta-label">Location</span>
              <span className="meta-value">{location}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Export with styles
export default (() => {
  const ArtworkDetailsStyled: QuartzComponent = (props) => <ArtworkDetails {...props} />
  
  ArtworkDetailsStyled.css = `
    .artwork-details {
      margin: 2rem 0;
      padding: 1.5rem;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .artwork-meta-grid {
      display: grid;
      gap: 1.5rem;
    }
    
    .meta-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-light, #f0f0f0);
    }
    
    .meta-item:last-child {
      border-bottom: none;
    }
    
    .meta-label {
      font-weight: 600;
      color: var(--gray);
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
      flex-shrink: 0;
      margin-right: 1rem;
    }
    
    .meta-value {
      color: var(--dark);
      text-align: right;
      font-weight: 500;
    }
    
    .features-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: flex-end;
    }
    
    .feature-badge {
      background: var(--secondary);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .exhibition-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      text-align: right;
    }
    
    .exhibition-item {
      font-style: italic;
      color: var(--gray);
      font-size: 0.9rem;
    }
    
    .pricing-section {
      background: rgba(37, 99, 235, 0.05);
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid rgba(37, 99, 235, 0.1);
    }
    
    .status-display {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .status-label {
      font-weight: 600;
      color: var(--gray);
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }
    
    .status-value {
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .status-value.available {
      color: #059669;
    }
    
    .status-value.sold {
      color: #6b7280;
    }
    
    .sold-date {
      font-size: 0.9rem;
      color: var(--gray);
      font-style: italic;
    }
    
    .price-display {
      margin-top: 0.5rem;
    }
    
    .price-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2563eb;
    }
    
    .buy-action {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .buy-button {
      background: #2563eb;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      text-align: center;
      transition: background 0.3s ease;
      font-size: 1rem;
    }
    
    .buy-button:hover {
      background: #1d4ed8;
      color: white;
    }
    
    .purchase-note {
      font-size: 0.8rem;
      color: var(--gray);
      text-align: center;
      margin: 0;
      font-style: italic;
    }
    
    @media (max-width: 768px) {
      .artwork-details {
        margin: 1rem 0;
        padding: 1rem;
      }
      
      .meta-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
      
      .meta-value, .features-row, .exhibition-list {
        text-align: left;
        justify-content: flex-start;
      }
      
      .price-amount {
        font-size: 1.3rem;
      }
    }
  `
  
  return ArtworkDetailsStyled
}) satisfies QuartzComponentConstructor