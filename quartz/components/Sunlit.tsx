import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Sunlit: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div className={`sunlit-container ${displayClass ?? ""}`}>
      {/* Sunlight rays - will change based on theme */}
      <div className="sunlight"></div>
      
      {/* Floor glow effect */}
      <div className="floor-glow"></div>
      
      {/* Window blinds structure */}
      <div id="blinds">
        <div className="shutters">
          {Array.from({length: 20}, (_, i) => (
            <div key={i} className="shutter"></div>
          ))}
        </div>
        
        <div className="vertical">
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      
      {/* Progressive blur layers */}
      <div id="progressive-blur">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      
      {/* Animated leaves */}
      <div className="leaves">
        {Array.from({length: 5}, (_, i) => (
          <div key={i} className="leaf"></div>
        ))}
      </div>
      
      {/* Theme transition overlay */}
      <div className="theme-transition-overlay"></div>
    </div>
  )
}

Sunlit.displayName = "Sunlit"
export default (() => Sunlit) satisfies QuartzComponentConstructor