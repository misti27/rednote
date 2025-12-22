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
  const fontFamily = theme.fontFamily;

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
      {/* Background Image Layer */}
      {config.coverImage && (
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
      <div className="relative z-10 h-full flex flex-col p-8">
        
        {/* Header Section (Only on first page) */}
        {pageIndex === 0 && (
          <div className="mb-6 animate-fade-in">
            <h1 
              className="font-bold leading-tight mb-4 break-words"
              style={{ fontSize: `${config.titleSize}px` }}
            >
              {content.title}
            </h1>
            
            <div className="flex items-center justify-between border-t border-current pt-3 opacity-80" style={{ borderColor: 'inherit' }}>
               <span className="text-xs font-medium tracking-widest uppercase">{content.subtitle}</span>
               <span className="text-xs font-bold px-2 py-1 rounded border border-current" style={{ borderColor: 'inherit' }}>
                  {content.tag}
               </span>
            </div>
          </div>
        )}

        {/* Continuation Header (Subsequent pages) */}
        {pageIndex > 0 && (
           <div className="mb-4 opacity-50 flex items-center gap-2">
              <span className="text-xs font-bold">{content.subtitle}</span>
              <span className="w-1 h-1 rounded-full bg-current"/>
              <span className="text-xs truncate max-w-[200px]">{content.title}</span>
           </div>
        )}

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
              <div className="w-2 h-2 rounded-full bg-current animate-pulse"/>
              <span className="text-[10px] font-mono tracking-widest">REDNOTE PRO CLONE</span>
           </div>
           <span className="text-xl font-bold font-mono opacity-80">
             {pageIndex + 1}<span className="text-xs opacity-50 mx-1">/</span>{totalPages}
           </span>
        </div>

        {/* Decorative Watermark (Optional based on theme) */}
        {theme.type === 'tech' && (
          <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
              <rect x="10" y="10" width="20" height="20" />
              <rect x="40" y="10" width="20" height="20" />
              <rect x="70" y="10" width="20" height="20" />
              <rect x="10" y="40" width="20" height="20" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
});

Card.displayName = 'Card';
