// quartz/components/CustomNav.tsx - Create this new file
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  links: { name: string; url: string }[]
}

const defaultOptions: Options = {
  links: [
    { name: "Now", url: "/now" },
    { name: "Principles", url: "/principles" },
    { name: "Coaching", url: "/coaching" },
    { name: "My Writing", url: "/my-writing" },
    { name: "My Art", url: "/my-art" },
  ]
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  const CustomNav: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={`custom-nav ${displayClass ?? ""}`}>
        <nav>
          <ul style="list-style: none; margin: 0; padding: 0;">
            {opts.links.map((link) => (
              <li style="margin-bottom: 2px;">
                <a 
                  href={link.url}
                  class="custom-nav-link"
                  style="display: block; padding: 0.7rem 0.75rem; border-radius: 10px; text-decoration: none; color: var(--darkgray); transition: all 0.2s ease; font-weight: 400; background: none; font-size: 1rem; line-height: 1.5;"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    )
  }

  CustomNav.css = `
    .custom-nav {
      margin-top: 1.5rem;
    }
    
    .custom-nav-link:hover {
      background: rgba(24, 94, 205, 0.06) !important;
      color: var(--tertiary) !important;
      transform: translateX(2px) !important;
    }
  `

  return CustomNav
}) satisfies QuartzComponentConstructor