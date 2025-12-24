import React, { useState, useEffect, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { EditorSidebar } from './components/EditorSidebar';
import { Card } from './components/Card';
import { DEFAULT_CONFIG, DEFAULT_CONTENT, THEMES } from './constants';
import { AppConfig, ContentData, Theme } from './types';

const App: React.FC = () => {
  // State for all themes (built-in + saved)
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(THEMES);
  
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [content, setContent] = useState<ContentData>(DEFAULT_CONTENT);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Derived state for current theme object
  const currentTheme = availableThemes.find(t => t.id === config.themeId) || availableThemes[0];

  // Logic: Handle Theme Selection with strict Reset or Restore
  const handleThemeSelect = (theme: Theme) => {
    if (theme.savedConfig) {
      // It's a saved custom theme, restore its specific config
      setConfig(prev => ({
        ...prev,
        ...theme.savedConfig,
        themeId: theme.id
      }));
    } else {
      // It's a built-in theme, RESET all custom appearance settings
      setConfig(prev => ({
        ...prev,
        themeId: theme.id,
        customBgColor: '',
        customTextColor: '',
        customFontFamily: undefined, // Clear custom font
        // We generally keep sizes and content, but reset styles
      }));
    }
  };

  // Logic: Save current style as new theme
  const handleSaveTheme = (name: string) => {
    const newThemeId = `custom-${Date.now()}`;
    
    // Create a snapshot of the current styling config
    const savedConfigSnapshot: Partial<AppConfig> = {
      customBgColor: config.customBgColor,
      customTextColor: config.customTextColor,
      customFontFamily: config.customFontFamily,
      titleSize: config.titleSize,
      bodySize: config.bodySize,
    };

    const newTheme: Theme = {
      id: newThemeId,
      name: name,
      // Use current visual state for the preview card in sidebar
      bgGradient: config.customBgColor ? '' : currentTheme.bgGradient, // If custom color, gradient is ignored in Card anyway, but for sidebar preview we might want a solid color representation if possible, or just keep original
      // To make the sidebar button look correct, if it's a solid custom color, we can fake a gradient class or handle it in EditorSidebar. 
      // For simplicity, we inherit the current theme's type and base properties, but attached savedConfig.
      textColor: config.customTextColor || currentTheme.textColor,
      accentColor: currentTheme.accentColor,
      fontFamily: config.customFontFamily || currentTheme.fontFamily,
      type: currentTheme.type,
      savedConfig: savedConfigSnapshot
    };

    setAvailableThemes(prev => [...prev, newTheme]);
    // Auto select the new theme
    setConfig(prev => ({ ...prev, themeId: newThemeId }));
  };

  // Logic: Paginate text
  const pages = useMemo(() => {
    // Estimate lines per page based on body font size and line height
    const linesPerPage = Math.floor(420 / (config.bodySize * 1.8));
    const allLines = content.body.split('\n');
    const contentPages: string[] = [];
    
    let currentChunk: string[] = [];
    let linesInCurrentPage = 0;

    const getVisualLines = (text: string, isHeading: boolean) => {
        if (!text) return 1; // Empty line takes up space
        if (isHeading) return 3; // Headings take more vertical space (size + margins)
        
        const charsPerLine = Math.floor(310 / (config.bodySize * 0.7)); 
        return Math.max(1, Math.ceil(text.length / charsPerLine));
    };

    allLines.forEach(line => {
      // Handle Manual Page Break
      if (line.trim() === '---' || line.trim() === '***') {
          if (currentChunk.length > 0) {
              contentPages.push(currentChunk.join('\n'));
              currentChunk = [];
              linesInCurrentPage = 0;
          }
          // If page break is the first thing, we just skip it to avoid empty page at start
          // unless we want to force empty pages. For now, assume split.
          return;
      }

      const isHeading = line.startsWith('## ');
      const visualLines = getVisualLines(line, isHeading);
      
      if (linesInCurrentPage + visualLines > linesPerPage && currentChunk.length > 0) {
        contentPages.push(currentChunk.join('\n'));
        currentChunk = [line];
        linesInCurrentPage = visualLines;
      } else {
        currentChunk.push(line);
        linesInCurrentPage += visualLines;
      }
    });
    
    if (currentChunk.length > 0) {
      contentPages.push(currentChunk.join('\n'));
    }

    return [null, ...(contentPages.length > 0 ? contentPages : [''])];
  }, [content.body, config.bodySize]);

  // Download Handler
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < pages.length; i++) {
        const cardElement = document.getElementById(`card-${i}`);
        if (cardElement) {
          const canvas = await html2canvas(cardElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
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
      <EditorSidebar
        config={config}
        setConfig={setConfig}
        content={content}
        setContent={setContent}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        availableThemes={availableThemes}
        onThemeSelect={handleThemeSelect}
        onSaveTheme={handleSaveTheme}
      />

      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="flex flex-wrap justify-center gap-8 pb-20">
          {pages.map((pageContent, index) => (
            <div key={index} className="flex flex-col gap-2">
               <span className="text-xs text-gray-400 font-mono text-center">
                 {index === 0 ? "COVER" : `PAGE ${index}`}
               </span>
               <Card
                  ref={(el) => { cardsRef.current[index] = el; }}
                  pageIndex={index}
                  totalPages={pages.length - 1}
                  config={config}
                  content={content}
                  theme={currentTheme}
                  pageContent={pageContent || ''}
                />
            </div>
          ))}
        </div>
        
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