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
          <script 
            async 
            src="https://subscribe-forms.beehiiv.com/embed.js"
          />
          <iframe 
            src="https://subscribe-forms.beehiiv.com/4c13f124-3647-4694-b23d-2884f32513a0" 
            class="beehiiv-embed"
            data-test-id="beehiiv-embed" 
            frameborder="0" 
            scrolling="no" 
            style={{
              width: '100%',
              maxWidth: '100%',
              height: '315px',
              margin: '0',
              borderRadius: '0px',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
          />
        </div>
      )
    }
    
    // Otherwise, show the regular interaction prompt
    // Encode title for email subject
    const emailSubject = encodeURIComponent(`Re: ${title}`)
    const emailBody = encodeURIComponent(`Hi Andrew, I just read "${title}" and wanted to share...`)
    
    // Array of rotating prompts
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
      margin: 3rem 0 2rem 0;
      padding: 2rem;
      background: var(--highlight);
      border-radius: 12px;
      text-align: center;
    }
    
    .post-interactions .interaction-prompt {
      font-size: 1.05rem;
      color: var(--darkgray);
      margin-bottom: 1.5rem;
      line-height: 1.6;
      min-height: 1.6em;
    }
    
    .post-interactions .email-reply {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: var(--secondary);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .post-interactions .email-reply:hover {
      background-color: var(--tertiary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 94, 205, 0.3);
      color: white;
    }
    
    /* Newsletter-specific styles */
    .post-interactions.newsletter-subscribe {
      padding: 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .post-interactions.newsletter-subscribe .interaction-prompt {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }
    
    .post-interactions.newsletter-subscribe .beehiiv-embed {
      display: block;
      margin: 0 auto;
    }
    
    @media (max-width: 800px) {
      .post-interactions {
        padding: 1.5rem;
      }
      
      .post-interactions .interaction-prompt {
        font-size: 1rem;
      }
      
      .post-interactions .email-reply {
        padding: 0.6rem 1.2rem;
        font-size: 0.95rem;
      }
      
      .post-interactions.newsletter-subscribe {
        padding: 2rem 1.5rem;
      }
      
      .post-interactions.newsletter-subscribe .interaction-prompt {
        font-size: 1.1rem;
      }
    }
  `

  return PostInteractions
}) satisfies QuartzComponentConstructor