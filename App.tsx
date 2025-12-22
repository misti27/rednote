import React, { useState, useEffect, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { EditorSidebar } from './components/EditorSidebar';
import { Card } from './components/Card';
import { DEFAULT_CONFIG, DEFAULT_CONTENT, THEMES } from './constants';
import { AppConfig, ContentData } from './types';
import { paginateText } from './utils/textUtils';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [content, setContent] = useState<ContentData>(DEFAULT_CONTENT);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Derived state for theme
  const currentTheme = THEMES.find(t => t.id === config.themeId) || THEMES[0];

  // Logic: Paginate text
  const pages = useMemo(() => {
    // Dynamic calculation: First page has less space due to title
    const firstPageLines = Math.max(5, 14 - Math.ceil(config.titleSize / 10)); 
    const otherPageLines = Math.floor(450 / (config.bodySize * 1.5)); // Approx height based calculation
    
    // We split the body roughly first
    const allLines = content.body.split('\n');
    const resultPages: string[] = [];
    
    let currentChunk: string[] = [];
    let linesInCurrentPage = 0;
    let isFirstPage = true;

    allLines.forEach(line => {
      // Crude line wrapping estimation
      const wrappedLines = Math.max(1, Math.ceil(line.length / (320 / (config.bodySize * 0.6))));
      const limit = isFirstPage ? firstPageLines : otherPageLines;

      if (linesInCurrentPage + wrappedLines > limit && currentChunk.length > 0) {
        resultPages.push(currentChunk.join('\n'));
        currentChunk = [line];
        linesInCurrentPage = wrappedLines;
        isFirstPage = false;
      } else {
        currentChunk.push(line);
        linesInCurrentPage += wrappedLines;
      }
    });
    
    if (currentChunk.length > 0) {
      resultPages.push(currentChunk.join('\n'));
    }

    return resultPages.length > 0 ? resultPages : [''];
  }, [content.body, config.titleSize, config.bodySize]);

  // Download Handler
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      
      // We process sequentially to not freeze browser too much
      for (let i = 0; i < pages.length; i++) {
        const cardElement = document.getElementById(`card-${i}`);
        if (cardElement) {
          const canvas = await html2canvas(cardElement, {
            scale: 2, // High res
            useCORS: true,
            backgroundColor: null, // Transparent if needed, but card has bg
            logging: false
          });
          
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
          if (blob) {
            zip.file(`rednote-card-${i + 1}.png`, blob);
          }
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'rednote-cards.zip');
    } catch (error) {
      console.error("Export failed", error);
      alert("导出失败，请重试");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100 font-sans">
      {/* Sidebar */}
      <EditorSidebar
        config={config}
        setConfig={setConfig}
        content={content}
        setContent={setContent}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />

      {/* Preview Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="flex flex-wrap justify-center gap-8 pb-20">
          {pages.map((pageContent, index) => (
            <div key={index} className="flex flex-col gap-2">
               <span className="text-xs text-gray-400 font-mono text-center">PAGE {index + 1}</span>
               <Card
                  ref={el => cardsRef.current[index] = el}
                  pageIndex={index}
                  totalPages={pages.length}
                  config={config}
                  content={content}
                  theme={currentTheme}
                  pageContent={pageContent}
                />
            </div>
          ))}
        </div>
        
        {/* Floating Action Tip (if mobile view simulated) */}
        <div className="fixed bottom-6 right-8 pointer-events-none md:hidden">
            <div className="bg-black/80 text-white px-4 py-2 rounded-full text-xs shadow-lg backdrop-blur">
               Scroll for more pages
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;