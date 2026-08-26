import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PhotoBook = ({ photos = [], title = "Current Tenure", subtitle = "Chess Club" }) => {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next');
  const [isAlbumAutoplay, setIsAlbumAutoplay] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isAlbumLightboxOpen, setIsAlbumLightboxOpen] = useState(false);
  const [albumLightboxIndex, setAlbumLightboxIndex] = useState(0);
  
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Measure container width for responsive calculations
  useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.offsetWidth);
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const flipNext = () => {
    if (isFlipping) return;
    if (spreadIndex >= Math.ceil(photos.length / 2)) return;
    setFlipDirection('next');
    setIsFlipping(true);
  };

  const flipPrev = () => {
    if (isFlipping) return;
    if (spreadIndex <= 0) return;
    setFlipDirection('prev');
    setIsFlipping(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAlbumLightboxOpen) {
        if (e.key === 'ArrowRight') {
          setAlbumLightboxIndex(prev => (prev + 1) % photos.length);
        } else if (e.key === 'ArrowLeft') {
          setAlbumLightboxIndex(prev => (prev - 1 + photos.length) % photos.length);
        } else if (e.key === 'Escape') {
          setIsAlbumLightboxOpen(false);
        }
      } else {
        // Prevent flipping if modal is not in focus
        if (e.key === 'ArrowRight') flipNext();
        else if (e.key === 'ArrowLeft') flipPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAlbumLightboxOpen, spreadIndex, isFlipping, photos.length]);

  // Autoplay
  useEffect(() => {
    if (!isAlbumAutoplay || isFlipping) return;
    const maxSpread = Math.ceil(photos.length / 2);
    const interval = setInterval(() => {
      if (spreadIndex >= maxSpread) {
        setSpreadIndex(0);
      } else {
        flipNext();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isAlbumAutoplay, spreadIndex, isFlipping, photos.length]);

  // Sync Lightbox index with spread index
  useEffect(() => {
    if (!isAlbumLightboxOpen) {
      const newSpread = Math.floor((albumLightboxIndex + 2) / 2);
      setSpreadIndex(newSpread);
    }
  }, [isAlbumLightboxOpen, albumLightboxIndex]);

  useEffect(() => {
    if (isAlbumLightboxOpen) {
      const photoIdx = Math.max(0, Math.min(photos.length - 1, 2 * spreadIndex - 2));
      setAlbumLightboxIndex(photoIdx);
    }
  }, [isAlbumLightboxOpen, photos.length, spreadIndex]);

  const jumpToPhoto = (idx) => {
    if (isFlipping) return;
    const targetSpread = Math.floor((idx + 2) / 2);
    setSpreadIndex(targetSpread);
  };

  const getPageContent = (pageNum) => {
    if (pageNum < 0 || pageNum > photos.length + 1) return null;

    if (pageNum === 0) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-955 flex flex-col justify-between p-6 text-center border-l-4 border-amber-800 shadow-inner rounded-r-xl select-none">
          <div className="border border-primary/30 rounded-lg p-4 flex-1 flex flex-col justify-center items-center gap-4">
            <span className="material-symbols-outlined text-primary text-5xl animate-pulse">menu_book</span>
            <div>
              <h3 className="font-serif text-2xl text-primary tracking-wide leading-tight mb-2">{title}</h3>
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/80">{subtitle}</p>
            </div>

          </div>
        </div>
      );
    }

    if (pageNum === photos.length + 1) {
      return (
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-955 to-amber-900 flex flex-col justify-center items-center p-6 text-center border-r-4 border-amber-800 shadow-inner rounded-l-xl select-none">
          <div className="border border-primary/20 rounded-lg p-4 w-full h-full flex flex-col justify-center items-center gap-4">
            <span className="material-symbols-outlined text-primary text-4xl">emoji_events</span>
            <h3 className="font-serif text-lg text-primary tracking-wider">{subtitle}</h3>
            <p className="text-[9px] font-label text-on-surface-variant/50 max-w-[150px]">
              Thank you for viewing.
            </p>
            <div className="h-0.5 w-10 bg-primary/20 mt-2" />
          </div>
        </div>
      );
    }

    const photoIdx = pageNum - 1;
    const photoUrl = photos[photoIdx];

    return (
      <div className="absolute inset-0 bg-[#fbf9f4] text-zinc-800 p-4 flex flex-col justify-between shadow-inner select-none border border-zinc-300/30">
        <div className="flex-1 w-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-400/25 shadow-md flex items-center justify-center p-1.5">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`Memory ${pageNum}`}
              className="max-w-full max-h-full object-contain"
              draggable="false"
            />
          ) : (
            <div className="text-zinc-700 font-label text-[10px] tracking-widest uppercase flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl opacity-50">image</span>
              Empty Frame
            </div>
          )}
        </div>
        <div className="mt-3 pt-2 border-t border-zinc-300/40 flex justify-between items-center px-1">
          <div>
            <h4 className="font-serif text-xs font-semibold text-zinc-700 tracking-wide">{title}</h4>
            <p className="text-[9px] text-zinc-500 font-label">{subtitle}</p>
          </div>
          <span className="font-mono text-[9px] font-semibold text-zinc-400 bg-zinc-200/50 px-2 py-0.5 rounded-full border border-zinc-300/30">
            Page {pageNum}
          </span>
        </div>
      </div>
    );
  };

  if (!photos || photos.length === 0) return null;

  const maxSpread = Math.ceil(photos.length / 2);
  const bookScale = containerWidth > 0 && containerWidth < 840 ? (containerWidth - 32) / 800 : 1;
  const bookHeight = 500 * bookScale;

  return (
    <div className="w-full flex flex-col items-center" ref={containerRef}>
      {/* 3D Page Turning Book Wrapper */}
      <div className="w-full flex items-center justify-center overflow-visible" style={{ height: `${bookHeight}px` }}>
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            const swipeThreshold = 50;
            if (info.offset.x > swipeThreshold) flipPrev();
            else if (info.offset.x < -swipeThreshold) flipNext();
          }}
          className="relative bg-zinc-950 border-8 border-stone-900 rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] flex select-none overflow-visible origin-center cursor-grab active:cursor-grabbing"
          style={{ width: '800px', height: '500px', perspective: '2000px', transform: `scale(${bookScale})`, transition: 'transform 0.1s ease-out' }}
        >
          <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-gradient-to-r from-stone-950 via-stone-800 to-stone-950 z-30 transform -translate-x-1/2 shadow-lg" />
          <div className="absolute top-0 bottom-0 left-1/2 w-8 bg-gradient-to-r from-black/40 to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-1/2 w-8 bg-gradient-to-l from-black/40 to-transparent z-20 pointer-events-none" />

          {/* LEFT SIDE */}
          <div className="w-1/2 h-full relative bg-zinc-900 rounded-l-2xl overflow-hidden shadow-2xl origin-right">
            {isFlipping && flipDirection === 'next'
              ? getPageContent(2 * spreadIndex - 1)
              : isFlipping && flipDirection === 'prev'
                ? getPageContent(2 * (spreadIndex - 1) - 1)
                : getPageContent(2 * spreadIndex - 1)}
          </div>

          {/* RIGHT SIDE */}
          <div className="w-1/2 h-full relative bg-zinc-900 rounded-r-2xl overflow-hidden shadow-2xl origin-left">
            {isFlipping && flipDirection === 'next'
              ? getPageContent(2 * (spreadIndex + 1))
              : isFlipping && flipDirection === 'prev'
                ? getPageContent(2 * spreadIndex)
                : getPageContent(2 * spreadIndex)}
          </div>

          {/* FLIPPING SHEET */}
          {isFlipping && (
            <motion.div
              key={`${spreadIndex}-${flipDirection}`}
              initial={{ rotateY: flipDirection === 'next' ? 0 : -180 }}
              animate={{ rotateY: flipDirection === 'next' ? -180 : 0 }}
              transition={{ duration: 0.85, ease: [0.645, 0.045, 0.355, 1.0] }}
              onAnimationComplete={() => {
                setSpreadIndex(prev => flipDirection === 'next' ? prev + 1 : prev - 1);
                setIsFlipping(false);
              }}
              style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '50%', transformStyle: 'preserve-3d', originX: 0, zIndex: 25 }}
            >
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(0deg)', transformStyle: 'preserve-3d' }}>
                {flipDirection === 'next' ? getPageContent(2 * spreadIndex) : getPageContent(2 * (spreadIndex - 1))}
                <div className="absolute inset-0 bg-black/5 pointer-events-none" />
              </div>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', transformStyle: 'preserve-3d' }}>
                {flipDirection === 'next' ? getPageContent(2 * (spreadIndex + 1) - 1) : getPageContent(2 * spreadIndex - 1)}
                <div className="absolute inset-0 bg-black/5 pointer-events-none" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Album Controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-12">
        <button
          onClick={flipPrev}
          disabled={spreadIndex <= 0}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none disabled:opacity-30 disabled:pointer-events-none"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">chevron_left</span>
        </button>
        <button
          onClick={() => setIsAlbumAutoplay(!isAlbumAutoplay)}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none ${isAlbumAutoplay ? 'bg-primary border-primary text-on-primary' : 'bg-surface-container-low border-outline-variant/20 hover:border-primary/50 text-on-surface'}`}
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">{isAlbumAutoplay ? 'pause' : 'play_arrow'}</span>
        </button>
        <button
          onClick={() => setIsAlbumLightboxOpen(true)}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">fullscreen</span>
        </button>
        <button
          onClick={flipNext}
          disabled={spreadIndex >= maxSpread}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none disabled:opacity-30 disabled:pointer-events-none"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">chevron_right</span>
        </button>
      </div>

      {/* Thumbnails */}
      <AnimatePresence>
        {showThumbnails && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mt-8 w-full border-t border-outline-variant/10 pt-6 overflow-hidden">
            <div className="flex overflow-x-auto gap-3 max-w-5xl mx-auto p-2 bg-surface-container-lowest/50 rounded-xl custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {photos.map((photo, idx) => {
                const isHighlighted = idx === Math.max(0, Math.min(photos.length - 1, 2 * spreadIndex - 2)) || idx === Math.max(0, Math.min(photos.length - 1, 2 * spreadIndex - 1));
                return (
                  <button key={idx} onClick={() => jumpToPhoto(idx)} className={`w-20 h-14 md:w-24 md:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all relative group ${isHighlighted && spreadIndex > 0 && spreadIndex < maxSpread ? 'border-primary scale-[0.98] shadow-md shadow-primary/20' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]'}`}>
                    <img src={photo || ''} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[11px] text-white font-bold font-mono bg-black/60 px-2 py-0.5 rounded">{idx + 1}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Lightbox */}
      <AnimatePresence>
        {isAlbumLightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 outline-none">
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto h-12">
              <div className="text-on-surface/75 text-xs md:text-sm font-label uppercase tracking-widest">{title} ({albumLightboxIndex + 1} / {photos.length})</div>
              <button onClick={() => setIsAlbumLightboxOpen(false)} className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary transition-colors text-on-surface hover:text-on-primary flex items-center justify-center outline-none shadow-lg"><span className="material-symbols-outlined text-xl">close</span></button>
            </div>
            <div className="flex-1 flex items-center justify-center relative max-w-7xl mx-auto w-full my-4">
              <button onClick={() => setAlbumLightboxIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1))} className="absolute left-2 md:left-4 z-10 w-12 h-12 rounded-full bg-surface-container-low/80 hover:bg-primary text-on-surface hover:text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"><span className="material-symbols-outlined text-2xl">chevron_left</span></button>
              <div className="relative max-h-[68vh] max-w-[85vw] flex items-center justify-center overflow-hidden rounded-xl shadow-2xl border border-outline-variant/10">
                <AnimatePresence mode="wait">
                  <motion.img key={albumLightboxIndex} src={photos[albumLightboxIndex]} alt="" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} className="max-h-[68vh] max-w-full object-contain rounded-xl" />
                </AnimatePresence>
              </div>
              <button onClick={() => setAlbumLightboxIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1))} className="absolute right-2 md:right-4 z-10 w-12 h-12 rounded-full bg-surface-container-low/80 hover:bg-primary text-on-surface hover:text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"><span className="material-symbols-outlined text-2xl">chevron_right</span></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoBook;
