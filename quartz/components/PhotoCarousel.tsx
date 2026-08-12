import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const PhotoCarousel: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const images: string[] = fileData.frontmatter?.images ?? []
  if (images.length === 0) {
    return null
  }

  return (
    <div class="photo-carousel">
      <div class="photo-carousel-track">
        {images.map((img, i) => {
          const src = img.startsWith("http") ? img : `/attachments/${img}`
          return (
            <div class="photo-carousel-slide">
              <img src={src} alt={`photo ${i + 1} of ${images.length}`} loading="lazy" />
            </div>
          )
        })}
      </div>
      <div class="photo-carousel-count">
        {images.length} photo{images.length === 1 ? "" : "s"} — swipe to see more →
      </div>
    </div>
  )
}

PhotoCarousel.css = `
  .photo-carousel {
    margin: 2rem 0;
  }

  .photo-carousel-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
    padding-bottom: 0.5rem;
    scrollbar-width: thin;
  }

  .photo-carousel-slide {
    flex: 0 0 100%;
    scroll-snap-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    overflow: hidden;
    background: var(--lightgray);
  }

  .photo-carousel-slide img {
    width: 100%;
    max-height: 70vh;
    object-fit: contain;
    display: block;
    border-radius: 12px;
  }

  .photo-carousel-count {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: var(--gray);
    text-align: center;
  }

  @media (min-width: 800px) {
    .photo-carousel-slide {
      flex-basis: 85%;
    }
  }
`

export default (() => PhotoCarousel) satisfies QuartzComponentConstructor
