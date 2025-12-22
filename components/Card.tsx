import React, { forwardRef } from 'react';
import { AppConfig, ContentData, Theme } from '../types';

interface CardProps {
  config: AppConfig;
  content: ContentData;
  theme: Theme;
  pageContent: string;
  pageIndex: number;
  totalPages: number;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  config,
  content,
  theme,
  pageContent,
  pageIndex,
  totalPages
}, ref) => {
  
  // Dynamic Styles
  const bgStyle = config.customBgColor ? { backgroundColor: config.customBgColor } : undefined;
  const textStyle = config.customTextColor ? { color: config.customTextColor } : { color: theme.textColor };
  
  // Font Logic: Config overrides Theme
  const fontFamily = config.customFontFamily || theme.fontFamily;
  
  const isCover = pageIndex === 0;

  return (
    <div 
      ref={ref}
      id={`card-${pageIndex}`}
      className={`relative w-[375px] aspect-[9/16] overflow-hidden flex flex-col shadow-2xl shrink-0 select-none ${!config.customBgColor ? theme.bgGradient : ''}`}
      style={{
        ...bgStyle,
        ...textStyle,
        fontFamily: `"${fontFamily}", sans-serif`
      }}
    >
      {/* Background Image Layer - ONLY FOR COVER */}
      {isCover && config.coverImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={config.coverImage} 
            alt="cover" 
            className="w-full h-full object-cover" 
          />
          <div 
            className="absolute inset-0 bg-white" 
            style={{ opacity: config.overlayOpacity }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className={`relative z-10 h-full flex flex-col p-8 ${isCover ? 'justify-center' : ''}`}>
        
        {/* === COVER PAGE LAYOUT === */}
        {isCover && (
          <div className="animate-fade-in flex flex-col h-full relative">
            
            {/* Top Badge (Optional visual anchor) */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-start opacity-60">
                <div className="w-8 h-8 border border-current rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">R</span>
                </div>
                <span className="text-xs font-mono tracking-widest">{content.subtitle}</span>
            </div>

            {/* Main Title Area - Centered/Bottom weighted */}
            <div className="mt-auto mb-12">
               {/* Tag */}
               <div className="mb-6">
                 <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider border-2 border-current uppercase">
                    {content.tag}
                 </span>
               </div>

               {/* Large Title */}
               <h1 
                  className="font-bold leading-[1.15] mb-6 break-words tracking-tight"
                  style={{ fontSize: `${config.titleSize * 1.5}px` }} // Bigger on cover
                >
                  {content.title}
                </h1>
                
                {/* Decorative Elements */}
                <div className="w-16 h-2 bg-current opacity-80 mb-4" />
                <p className="text-sm opacity-80 font-medium max-w-[80%] leading-relaxed">
                   Visual Notes Collection
                   <br/>
                   Designed for Creators.
                </p>
            </div>
          </div>
        )}

        {/* === CONTENT PAGE LAYOUT === */}
        {!isCover && (
           <>
              {/* Header */}
              <div className="mb-6 opacity-60 flex items-center gap-3 border-b border-current/20 pb-4">
                  <span className="text-xs font-bold whitespace-nowrap">{content.subtitle}</span>
                  <span className="w-px h-3 bg-current/50"/>
                  <span className="text-xs truncate font-medium">{content.title}</span>
              </div>

              {/* Body Content */}
              <div className="flex-1 whitespace-pre-wrap leading-relaxed overflow-hidden">
                <p 
                  style={{ fontSize: `${config.bodySize}px`, lineHeight: 1.8 }}
                  className={theme.type === 'modern' ? 'font-normal' : ''}
                >
                  {pageContent}
                </p>
              </div>

              {/* Footer / Pagination */}
              <div className="mt-auto pt-6 flex justify-between items-end opacity-60">
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-current"/>
                    <span className="text-[10px] font-mono tracking-widest uppercase truncate max-w-[150px]">
                      {content.tag}
                    </span>
                </div>
                <span className="text-lg font-bold font-mono opacity-80">
                  {pageIndex}<span className="text-xs opacity-50 mx-1">/</span>{totalPages}
                </span>
              </div>
           </>
        )}

        {/* Decorative Watermark (Optional based on theme) - Only on Content Pages to keep Cover clean? Or both? */}
        {theme.type === 'tech' && !isCover && (
          <div className="absolute bottom-20 right-0 p-4 opacity-10 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
               <path d="M10 10 H 90 V 90 H 10 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
               <path d="M20 20 H 80 V 80 H 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
               <circle cx="50" cy="50" r="10" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
});

Card.displayName = 'Card';