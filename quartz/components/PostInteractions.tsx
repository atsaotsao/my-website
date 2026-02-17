import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const PostInteractions: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
    const slug = fileData.slug || ""
    
    // Only show on my-writing posts (not the index page)
    if (!slug.startsWith("my-writing/") || slug === "my-writing/index") {
      return null
    }
    
    // Check if post has newsletter tag
    const tags = fileData.frontmatter?.tags || []
    const isNewsletter = tags.includes("newsletter")
    
    const title = fileData.frontmatter?.title || "this post"
    
    // If it's a newsletter post, show Beehiiv embed
    if (isNewsletter) {
      return (
        <div class="post-interactions newsletter-subscribe">
          <p class="interaction-prompt">
            ✉️ Want more like this in your inbox?
          </p>
          <div class="beehiiv-container">
            <script 
              async 
              src="https://subscribe-forms.beehiiv.com/embed.js"
            />
            <iframe 
              src="https://subscribe-forms.beehiiv.com/4c13f124-3647-4694-b23d-2884f32513a0" 
              data-test-id="beehiiv-embed" 
              frameborder="0" 
              scrolling="no"
            />
          </div>
        </div>
      )
    }
    
    // Otherwise, show the regular interaction prompt
    const emailSubject = encodeURIComponent(`Re: ${title}`)
    const emailBody = encodeURIComponent(`Hi Andrew, I just read "${title}" and wanted to share...`)
    
    const prompts = [
      "💭 What's alive in you after reading this?",
      "🌱 Does this spark something for you?",
      "✨ I'd love to hear what resonates.",
      "🗨️ What questions are emerging?",
      "💫 What's stirring in you?",
      "🌿 Does this touch something you're navigating?",
    ]
    
    return (
      <div class="post-interactions">
        <p class="interaction-prompt" id="interaction-prompt"></p>
        <a 
          href={`mailto:andrew@codelesscoach.com?subject=${emailSubject}&body=${emailBody}`} 
          class="email-reply"
          target="_blank"
          rel="noopener noreferrer"
        >
          Let's talk about it →
        </a>
        
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const prompts = ${JSON.stringify(prompts)};
              const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
              document.getElementById('interaction-prompt').innerText = randomPrompt;
            })();
          `
        }} />
      </div>
    )
  }

  PostInteractions.css = `
    .post-interactions {
      margin: 3rem 0 2rem 0 !important;
      padding: 2rem !important;
      background: var(--highlight) !important;
      border-radius: 12px !important;
      text-align: center !important;
    }
    
    .post-interactions .interaction-prompt {
      font-size: 1.05rem !important;
      color: var(--darkgray) !important;
      margin-bottom: 1.5rem !important;
      line-height: 1.6 !important;
      min-height: 1.6em !important;
    }
    
    .post-interactions .email-reply {
      display: inline-block !important;
      padding: 0.75rem 1.5rem !important;
      background-color: var(--secondary) !important;
      color: white !important;
      text-decoration: none !important;
      border-radius: 6px !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
    }
    
    .post-interactions .email-reply:hover {
      background-color: var(--tertiary) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(24, 94, 205, 0.3) !important;
      color: white !important;
    }
    
    /* Newsletter-specific styles */
    .post-interactions.newsletter-subscribe {
      padding: 2rem 1.5rem !important;
    }
    
    .post-interactions.newsletter-subscribe .interaction-prompt {
      font-size: 1.15rem !important;
      margin-bottom: 1.5rem !important;
      font-weight: 500 !important;
    }
    
    /* Beehiiv container */
    .post-interactions.newsletter-subscribe .beehiiv-container {
      width: 100% !important;
      max-width: 560px !important;
      margin: 0 auto !important;
      overflow: visible !important;
    }
    
    /* Desktop iframe */
    .post-interactions.newsletter-subscribe .beehiiv-container iframe {
      width: 560px !important;
      height: 339px !important;
      border: none !important;
      display: block !important;
      margin: 0 auto !important;
      background: transparent !important;
      transform-origin: top center !important;
    }
    
    /* Tablets */
    @media (max-width: 768px) {
      .post-interactions {
        padding: 1.5rem 1rem !important;
      }
      
      .post-interactions.newsletter-subscribe {
        padding: 1.75rem 1.25rem !important;
      }
      
      .post-interactions.newsletter-subscribe .beehiiv-container {
        height: 305px !important; /* 339 * 0.9 */
        overflow: hidden !important;
      }
      
      .post-interactions.newsletter-subscribe .beehiiv-container iframe {
        transform: scale(0.9) !important;
      }
    }
    
    /* Large phones */
    @media (max-width: 480px) {
      .post-interactions.newsletter-subscribe {
        padding: 1.5rem 1rem !important;
      }
      
      .post-interactions.newsletter-subscribe .interaction-prompt {
        font-size: 1.05rem !important;
        margin-bottom: 1.25rem !important;
      }
      
      .post-interactions.newsletter-subscribe .beehiiv-container {
        height: 254px !important; /* 339 * 0.75 */
      }
      
      .post-interactions.newsletter-subscribe .beehiiv-container iframe {
        transform: scale(0.75) !important;
      }
    }
    
    /* Small phones */
    @media (max-width: 400px) {
      .post-interactions.newsletter-subscribe {
        padding: 1.25rem 0.75rem !important;
      }
      
      .post-interactions.newsletter-subscribe .interaction-prompt {
        font-size: 1rem !important;
      }
      
      .post-interactions.newsletter-subscribe .beehiiv-container {
        height: 237px !important; /* 339 * 0.7 */
      }
      
      .post-interactions.newsletter-subscribe .beehiiv-container iframe {
        transform: scale(0.7) !important;
      }
    }
    
    /* Very small phones */
    @media (max-width: 360px) {
      .post-interactions.newsletter-subscribe .beehiiv-container {
        height: 220px !important; /* 339 * 0.65 */
      }
      
      .post-interactions.newsletter-subscribe .beehiiv-container iframe {
        transform: scale(0.65) !important;
      }
    }
  `

  return PostInteractions
}) satisfies QuartzComponentConstructor