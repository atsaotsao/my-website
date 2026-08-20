import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const SlideshowEyebrow: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const tags: string[] = fileData.frontmatter?.tags ?? []
  if (!tags.includes("exhibition")) {
    return null
  }
  return <p class="slideshow-eyebrow">Exhibition</p>
}

SlideshowEyebrow.css = `
  .slideshow-eyebrow {
    margin: 1.5rem 0 0 0;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #8b5cf6;
  }
`

export default (() => SlideshowEyebrow) satisfies QuartzComponentConstructor
