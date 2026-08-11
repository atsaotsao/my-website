import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import GraphConstructor from "./Graph"

const GraphInstance = GraphConstructor({
  localGraph: {
    drag: true,
    zoom: true,
    depth: 1,
    scale: 1.1,
    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: false,
    enableRadial: false,
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.85,
    repelForce: 3,
    centerForce: 1.5,
    linkDistance: 120,
    fontSize: 0.7,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: true,
    enableRadial: true,
  },
})

const ExploreGraph: QuartzComponent = (props: QuartzComponentProps) => {
  if (props.fileData.slug !== "explore") {
    return null
  }
  return (
    <>
      <GraphInstance {...props} />
      {/*
        The global graph only ever renders when someone clicks the (now-hidden)
        toggle icon - graph.inline.ts wires that up on the "nav" event, and
        reads the container's offsetWidth synchronously to size its canvas.
        Triggering on "nav" (which fires very early) races the initial layout
        pass and measures width 0. Waiting for window "load" instead ensures
        layout has settled before we synthesize the click.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function triggerExploreGraph() {
              if (document.body.getAttribute('data-slug') !== 'explore') return;
              var icon = document.querySelector('.global-graph-icon');
              if (icon) icon.click();
            }
            if (document.readyState === 'complete') {
              setTimeout(triggerExploreGraph, 50);
            } else {
              window.addEventListener('load', function() {
                setTimeout(triggerExploreGraph, 50);
              });
            }
          `,
        }}
      />
    </>
  )
}

ExploreGraph.afterDOMLoaded = GraphInstance.afterDOMLoaded
ExploreGraph.beforeDOMLoaded = GraphInstance.beforeDOMLoaded

ExploreGraph.css = `
  ${GraphInstance.css}

  body[data-slug="explore"] .article-title,
  body[data-slug="explore"] .content-meta,
  body[data-slug="explore"] .tags,
  body[data-slug="explore"] article {
    display: none !important;
  }

  body[data-slug="explore"] .center {
    padding-bottom: 0 !important;
  }

  /* hide the small inline graph box + its toggle icon; the full graph is always on for this page */
  body[data-slug="explore"] .graph > h3,
  body[data-slug="explore"] .graph > .graph-outer {
    display: none !important;
  }

  body[data-slug="explore"] .graph > .global-graph-outer {
    display: block !important;
    position: relative !important;
    inset: auto !important;
    width: 100% !important;
    height: calc(100vh - 8rem) !important;
    min-height: 400px !important;
    z-index: 1 !important;
    backdrop-filter: none !important;
  }

  body[data-slug="explore"] .global-graph-container {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    transform: none !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: 8px !important;
  }
`

export default (() => ExploreGraph) satisfies QuartzComponentConstructor
