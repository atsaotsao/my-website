import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const PostInteractions: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
    const slug = fileData.slug || ""
    
    // Only show on my-writing posts (not the index page)
    if (!slug.startsWith("my-writing/") || slug === "my-writing/index") {
      return null
    }
    
    const title = fileData.frontmatter?.title || "this post"
    
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
    }
  `

  return PostInteractions
}) satisfies QuartzComponentConstructor