import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const MobileNavToggle: QuartzComponent = (_props: QuartzComponentProps) => {
  return (
    <>
      <button
        class="mobile-nav-toggle"
        id="mobile-nav-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded="false"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            class="mobile-nav-toggle-icon-bars"
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            class="mobile-nav-toggle-icon-x"
            d="M5 5l14 14M19 5L5 19"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            style="display: none;"
          />
        </svg>
      </button>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function initMobileNavToggle() {
              var toggleBtn = document.getElementById('mobile-nav-toggle');
              var nav = document.querySelector('.sidebar.left .custom-nav');
              if (!toggleBtn || !nav || toggleBtn.dataset.navBound) return;
              toggleBtn.dataset.navBound = '1';
              var bars = toggleBtn.querySelector('.mobile-nav-toggle-icon-bars');
              var x = toggleBtn.querySelector('.mobile-nav-toggle-icon-x');
              toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                var isOpen = nav.classList.toggle('mobile-nav-open');
                toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                if (bars) bars.style.display = isOpen ? 'none' : '';
                if (x) x.style.display = isOpen ? '' : 'none';
              });
              document.addEventListener('click', function(e) {
                if (!nav.classList.contains('mobile-nav-open')) return;
                if (nav.contains(e.target) || toggleBtn.contains(e.target)) return;
                nav.classList.remove('mobile-nav-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
                if (bars) bars.style.display = '';
                if (x) x.style.display = 'none';
              });
            }
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initMobileNavToggle);
            } else {
              initMobileNavToggle();
            }
          `,
        }}
      />
    </>
  )
}

MobileNavToggle.css = `
  .mobile-nav-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 100;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 8px;
    border: 1px solid var(--lightgray);
    background: var(--light);
    color: var(--dark);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }

  @media (max-width: 800px) {
    .mobile-nav-toggle {
      display: flex;
    }

    .sidebar.left .custom-nav {
      display: none !important;
      position: fixed !important;
      top: 4rem !important;
      left: 1rem !important;
      z-index: 99 !important;
      background: var(--light) !important;
      border: 1px solid var(--lightgray) !important;
      border-radius: 10px !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
      padding: 0.5rem !important;
      min-width: 200px !important;
      max-width: calc(100vw - 2rem) !important;
      max-height: calc(100vh - 5rem) !important;
      overflow-y: auto !important;
      margin-top: 0 !important;
      width: auto !important;
    }

    .sidebar.left .custom-nav.mobile-nav-open {
      display: block !important;
    }
  }
`

export default (() => MobileNavToggle) satisfies QuartzComponentConstructor
