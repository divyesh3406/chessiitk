import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/10 px-6 py-16 md:px-12 lg:px-20">
      {/* Changed to a 12-column grid for finer control over column widths */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        
        {/* Brand Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0 }}
          className="col-span-1 lg:col-span-4 text-center lg:text-left flex flex-col items-center lg:items-start" 
        >
          <h4 className="mb-4 text-xl font-serif text-primary">Chess Club</h4>
          <p className="mb-6 max-w-sm text-on-surface-variant">
            The official digital portal for the IIT Kanpur Chess Club. Archiving brilliance since 2007.
          </p>
        </motion.div>

        {/* Organization Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="col-span-1 lg:col-span-2 text-center lg:text-left"
        >
          <h5 className="mb-6 text-sm font-label uppercase tracking-widest text-primary">
            Organization
          </h5>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li>
              <Link to="/blog/16" className="cursor-pointer transition-colors hover:text-primary">
                Our History
              </Link>
            </li>
            <li>
              <Link to="/contact" className="cursor-pointer transition-colors hover:text-primary">
                Core Team
              </Link>
            </li>
            <li>
              <Link to="/previous-teams" className="cursor-pointer transition-colors hover:text-primary">
                Alumni Network
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="cursor-pointer transition-colors hover:text-primary">
                Gallery
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Connect Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          className="col-span-1 lg:col-span-6 text-center lg:text-left"
        >
          <h5 className="mb-6 text-sm font-label uppercase tracking-widest text-primary text-center lg:text-left">
            Connect
          </h5>
          {/* Changed to 3 columns to accommodate 3 links each */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <a
                href="https://www.instagram.com/chessiitk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-full items-center justify-center lg:justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary gap-2"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://x.com/chessiitk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-full items-center justify-center lg:justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X</span>
              </a>
              <a
                href="https://www.linkedin.com/company/chess-iitk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-full items-center justify-center lg:justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <a
                href="https://www.facebook.com/chessclubiitk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-full items-center justify-center lg:justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://www.youtube.com/@chessiitk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-full items-center justify-center lg:justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
              <a
                href="https://discord.com/channels/845027863392026685/856260758781165620"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-full items-center justify-center lg:justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107 14.361 14.361 0 0 0 1.226 1.99.075.075 0 0 0 .084-.03 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
                <span>Discord</span>
              </a>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-3">
              <a
                href="https://www.chess.com/club/iitk-chess-club"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-full items-center justify-center lg:justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2a3.5 3.5 0 0 0-3.5 3.5c0 1 .42 1.9 1.1 2.54A5.96 5.96 0 0 0 7 13h10a5.96 5.96 0 0 0-2.6-4.96c.68-.64 1.1-1.54 1.1-2.54A3.5 3.5 0 0 0 12 2zm0 13c-2.33 0-4.67.67-6 2v2h12v-2c-1.33-1.33-3.67-2-6-2z"/>
                </svg>
                <span>Chess.com</span>
              </a>
              <a
                href="https://www.threads.com/@chessiitk?xmt=AQG0WclpAXcX0l6MVRZkMQ6ltp7AQi8X1H4vyrFo6qXNahU"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-full items-center justify-center lg:justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.786 15.658c-.658 0-1.254-.383-1.472-1.026-.264-.78-.063-1.634.502-2.12.392-.338.891-.52 1.408-.515.682 0 1.272.38 1.468 1.018.258.785.056 1.634-.509 2.12-.392.343-.896.526-1.413.523h.016zm5.836-3.23c0-3.66-2.585-6.38-6.195-6.38-4.24 0-7.23 2.92-7.23 7.02 0 3.76 2.68 6.4 6.27 6.4a8.21 8.21 0 0 0 4.14-1.11l-.81-1.39a6.6 6.6 0 0 1-3.33.9c-2.48 0-4.47-1.74-4.47-4.54 0-2.73 1.95-4.8 4.77-4.8 2.64 0 4.39 1.83 4.39 4.34 0 1.47-.79 2.27-1.85 2.27-.64 0-1.11-.38-1.11-1.05V9.45c0-.85-.45-1.53-1.47-1.53-1.39 0-2.31 1.25-2.31 3.12 0 1.77.81 2.87 2.19 2.87.64 0 1.15-.35 1.42-.87h.06c.2.66.79 1.13 1.54 1.13 1.96 0 3.25-1.58 3.25-4.25v.008z"/>
                </svg>
                <span>Threads</span>
              </a>
              <a
                href="mailto:chessiitk21@gmail.com"
                className="inline-flex h-9 w-full items-center justify-center lg:justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary gap-2"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Email</span>
              </a>
            </div>

          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
        className="mt-16 flex flex-col sm:flex-row items-center sm:justify-between border-t border-outline-variant/5 pt-8 text-[10px] uppercase tracking-widest text-on-surface-variant/40 text-center sm:text-left gap-4"
      >
      </motion.div>
    </footer>
  );
};

export default Footer;