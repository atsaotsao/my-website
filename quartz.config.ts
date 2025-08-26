// quartz.config.ts - Complete configuration with sidebar popover fix
import type { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    contentDir: "/Users/andrewtsao/new-quartz/content",
    pageTitle: "Andrew Tsao",
    pageTitleSuffix: "",
    baseUrl: "localhost", // Change this to your actual domain when deploying
    locale: "en-US",
    enableSPA: true,
    enablePopovers: true, // ✅ Disable all popovers globally
    analytics: { provider: "plausible" },
    ignorePatterns: [
      "**/.obsidian/**",
      "**/.git/**", 
      "**/node_modules/**",
      "**/.DS_Store",
      "**/Archive/**",
      "**/Templates/**", 
      "**/template/**",
      "**/Private/**",
      "**/private/**",
      "**/Trash/**",
      "**/*.trash/**",
      "**/Untitled/**",
      "**/Journal/**",
      "**/Daily/**",
      "**/journal/**",
      "**/daily/**",
      "**/_*",
      "**/draft*",
    ],
    defaultDateType: "published",
    
    head: [
      {
        tag: "link",
        props: {
          rel: "preconnect",
          href: "https://fonts.googleapis.com"
        }
      },
      {
        tag: "link", 
        props: {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: ""
        }
      },
      {
        tag: "link",
        props: {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Schoolbell&display=swap"
        }
      },
      {
        tag: "script",
        props: { type: "text/javascript" },
        children: `
console.log('🔄 Name rotation starting');

function initNameRotation() {
    console.log('🚀 Initializing name rotation...');
    
    const titleElement = document.querySelector('.page-title a') || document.querySelector('.page-title');
    console.log('📍 Title element found:', titleElement);
    
    if (titleElement) {
        const currentText = titleElement.textContent.trim();
        console.log('📝 Current title text:', currentText);
        
        if (currentText.includes('Andrew') || currentText.includes('Tsao')) {
            console.log('✅ Setting up name rotation');
            
            titleElement.innerHTML = \`
                <span class="name-full active">Andrew Tsao</span>
                <span class="name-nick">Atsao</span>
                <span class="name-zh">曹明鑫</span>
            \`;
            
            let currentName = 0;
            const names = ['name-full', 'name-nick', 'name-zh'];
            const displayNames = ['Andrew Tsao', 'Atsao', '曹明鑫'];
            
            console.log('🎬 Starting rotation');
            
            if (window.nameRotationInterval) {
                clearInterval(window.nameRotationInterval);
            }
            
            window.nameRotationInterval = setInterval(() => {
                const currentElement = titleElement.querySelector(\`.\${names[currentName]}\`);
                if (currentElement) {
                    currentElement.classList.remove('active');
                }
                
                currentName = (currentName + 1) % 3;
                
                const nextElement = titleElement.querySelector(\`.\${names[currentName]}\`);
                if (nextElement) {
                    nextElement.classList.add('active');
                    console.log(\`🔄 Rotated to: \${displayNames[currentName]}\`);
                }
            }, 3000);
            
            console.log('✅ Name rotation setup complete');
        } else {
            console.log('❌ Title text does not match. Found:', currentText);
        }
    } else {
        console.log('❌ No title element found');
    }
}

// Multiple tries for name rotation
setTimeout(initNameRotation, 100);
setTimeout(initNameRotation, 500);
setTimeout(initNameRotation, 1000);
setTimeout(initNameRotation, 2000);

document.addEventListener('DOMContentLoaded', initNameRotation);
document.addEventListener('nav', () => {
    if (window.nameRotationInterval) clearInterval(window.nameRotationInterval);
    setTimeout(initNameRotation, 200);
});
        `
      },
      {
        tag: "script",
        props: { type: "text/javascript" },
        children: `
// Manual popover implementation for main content only
// Since we disabled global popovers, we'll implement them just for main content

import("https://cdn.skypack.dev/@floating-ui/dom").then(({ computePosition, flip, inline, shift }) => {
  console.log('🎯 Loading custom popover system for main content only...');
  
  let activeAnchor = null;
  const parser = new DOMParser();
  
  async function fetchCanonical(url) {
    try {
      const response = await fetch(url.toString());
      return response;
    } catch (err) {
      console.error('Failed to fetch:', err);
      return null;
    }
  }
  
  function normalizeRelativeURLs(html, baseUrl) {
    // Simple URL normalization
    const links = html.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        link.href = new URL(href, baseUrl).toString();
      }
    });
  }
  
  async function mouseEnterHandler(event) {
    const link = event.target;
    activeAnchor = link;
    
    if (link.dataset.noPopover === "true") {
      return;
    }
    
    // Only show popovers for main content links (not sidebar)
    if (link.closest('.sidebar.left')) {
      console.log('🚫 Skipping popover for sidebar link');
      return;
    }
    
    console.log('✅ Showing popover for main content link:', link.href);
    
    const targetUrl = new URL(link.href);
    const hash = decodeURIComponent(targetUrl.hash);
    targetUrl.hash = "";
    targetUrl.search = "";
    
    const popoverId = \`popover-\${targetUrl.pathname}\`;
    const existingPopover = document.getElementById(popoverId);
    
    if (existingPopover) {
      showPopover(existingPopover, link, event.clientX, event.clientY);
      return;
    }
    
    const response = await fetchCanonical(targetUrl);
    if (!response) return;
    
    const contents = await response.text();
    const html = parser.parseFromString(contents, "text/html");
    normalizeRelativeURLs(html, targetUrl);
    
    // Create popover element
    const popoverElement = document.createElement("div");
    popoverElement.id = popoverId;
    popoverElement.classList.add("popover");
    
    const popoverInner = document.createElement("div");
    popoverInner.classList.add("popover-inner");
    popoverElement.appendChild(popoverInner);
    
    const hints = html.getElementsByClassName("popover-hint");
    if (hints.length === 0) return;
    
    Array.from(hints).forEach(hint => popoverInner.appendChild(hint.cloneNode(true)));
    
    document.body.appendChild(popoverElement);
    showPopover(popoverElement, link, event.clientX, event.clientY);
  }
  
  async function showPopover(popoverElement, link, clientX, clientY) {
    clearActivePopovers();
    popoverElement.classList.add("active-popover");
    
    const { x, y } = await computePosition(link, popoverElement, {
      strategy: "fixed",
      middleware: [inline({ x: clientX, y: clientY }), shift(), flip()],
    });
    
    Object.assign(popoverElement.style, {
      transform: \`translate(\${x.toFixed()}px, \${y.toFixed()}px)\`,
    });
  }
  
  function clearActivePopovers() {
    activeAnchor = null;
    document.querySelectorAll(".popover").forEach(popover => {
      popover.classList.remove("active-popover");
    });
  }
  
  function setupMainContentPopovers() {
    console.log('🔧 Setting up popovers for main content only...');
    
    // Only attach to links in main content area, not sidebar
    const mainContentLinks = document.querySelectorAll('.center a.internal, main a.internal, article a.internal');
    console.log(\`Found \${mainContentLinks.length} main content links\`);
    
    mainContentLinks.forEach(link => {
      // Remove existing listeners
      link.removeEventListener('mouseenter', mouseEnterHandler);
      link.removeEventListener('mouseleave', clearActivePopovers);
      
      // Add new listeners
      link.addEventListener('mouseenter', mouseEnterHandler);
      link.addEventListener('mouseleave', clearActivePopovers);
    });
    
    console.log('✅ Main content popovers setup complete');
  }
  
  // Setup after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMainContentPopovers);
  } else {
    setupMainContentPopovers();
  }
  
  // Re-setup on navigation
  document.addEventListener('nav', () => {
    setTimeout(setupMainContentPopovers, 100);
  });
  
}).catch(err => {
  console.log('📦 Could not load @floating-ui, using simple fallback');
  
  // Simple fallback without external dependencies
  function setupSimplePopovers() {
    const mainContentLinks = document.querySelectorAll('.center a.internal, main a.internal, article a.internal');
    
    mainContentLinks.forEach(link => {
      link.addEventListener('mouseenter', (e) => {
        if (link.closest('.sidebar.left')) return; // Skip sidebar links
        
        // Simple tooltip-style popover
        const tooltip = document.createElement('div');
        tooltip.className = 'simple-popover';
        tooltip.textContent = 'Preview: ' + (link.textContent || link.href);
        tooltip.style.cssText = \`
          position: fixed;
          background: var(--light);
          border: 1px solid var(--lightgray);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          z-index: 9999;
          max-width: 300px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          left: \${e.clientX + 10}px;
          top: \${e.clientY - 30}px;
        \`;
        
        document.body.appendChild(tooltip);
        link._tooltip = tooltip;
      });
      
      link.addEventListener('mouseleave', () => {
        if (link._tooltip) {
          link._tooltip.remove();
          link._tooltip = null;
        }
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', setupSimplePopovers);
  document.addEventListener('nav', setupSimplePopovers);
});
        `
      }
    ],
    
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "EB Garamond",
        body: "EB Garamond", 
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#f0f0f2",
          lightgray: "#d8d8da",
          gray: "#868889",
          darkgray: "#202225",
          dark: "#202225",
          secondary: "#027b1f",
          tertiary: "#185ecd",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "rgba(255, 242, 54, 0.53)",
        },
        darkMode: {
          light: "#151515",
          lightgray: "#2a2a2b",
          gray: "#5f6062",
          darkgray: "#d4d4d4",
          dark: "#ececec",
          secondary: "#2aa14e",
          tertiary: "#6b8ce6",
          highlight: "rgba(143, 159, 169, 0.20)",
          textHighlight: "rgba(255, 242, 54, 0.45)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem", "git"],
        frontmatterFields: {
          created: ["published", "date", "created", "creation date"],
          modified: ["modified", "lastmod", "updated"]
        }
      }),
      Plugin.ObsidianFlavoredMarkdown({
  comments: true,
  highlight: true,
  wikilinks: true,
  callouts: true,
  mermaid: true,
  parseTags: true,
  parseArrows: true,
  parseBlockReferences: true,
  enableInHtmlEmbed: false,
  enableYouTubeEmbed: true,
  // Add these to fix paragraph handling
  breaks: true,        // Convert line breaks to <br>
  linkify: true,       // Auto-convert URLs
  typographer: false,  // Don't auto-replace quotes
}),
      Plugin.GitHubFlavoredMarkdown({
  enableSmartyPants: true,  // This might affect paragraph handling
  linkHeadings: true,
  breaks: true,
}),
      Plugin.TableOfContents({ maxDepth: 3 }),
      Plugin.CrawlLinks({
        markdownLinkResolution: "shortest",
        prettyLinks: true,
        openLinksInNewTab: false,
      }),
      Plugin.Description(),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.ExplicitPublish()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      // In your quartz.config.ts, update the FolderPage plugin:

Plugin.FolderPage({
  sort: (f1, f2) => {
    const getDate = (f) => {
      const dateFields = [
        f.frontmatter?.published,
        f.frontmatter?.pubDate, 
        f.frontmatter?.date,
        f.frontmatter?.created,
        f.frontmatter?.['creation date'],
        f.frontmatter?.['modified'],
        f.frontmatter?.lastmod,
        f.dates?.published,
        f.dates?.created,
        f.dates?.modified
      ];
      
      for (const dateField of dateFields) {
        if (dateField && dateField !== 'false' && dateField !== false) {
          const parsed = new Date(dateField);
          if (!isNaN(parsed.getTime())) {
            return parsed;
          }
        }
      }
      
      return f.dates?.created || f.dates?.modified || new Date(0);
    };
    
    const date1 = getDate(f1);
    const date2 = getDate(f2);
    
    return date2.getTime() - date1.getTime();
  },
  // Add filter to exclude main pages
  // In your existing quartz.config.ts, just update this part:

filter: (f) => {
  const excludedSlugs = [
    'index',
    'my-art/index', 
    'my-writing/index',
    'my-playlist/index', // ← ADD ONLY THIS LINE
    'coaching',
    'now', 
    'principles'
  ];
  
  if (f.frontmatter?.exclude_from_backlinks || f.frontmatter?.no_backlink) {
    return false;
  }
  
  return !excludedSlugs.includes(f.slug);
}
}),
      Plugin.TagPage(),
      Plugin.ContentIndex(),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config