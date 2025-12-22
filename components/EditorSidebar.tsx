import React, { useRef } from 'react';
import { Settings, Type, Image as ImageIcon, Trash2, Palette, Download } from 'lucide-react';
import { THEMES } from '../constants';
import { AppConfig, ContentData } from '../types';

interface EditorSidebarProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData>>;
  onDownload: () => void;
  isDownloading: boolean;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  config,
  setConfig,
  content,
  setContent,
  onDownload,
  isDownloading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full md:w-[420px] bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col shadow-xl z-20">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-none">RedNote Pro</h1>
            <span className="text-xs text-gray-400">Visual Clone Engineer</span>
          </div>
        </div>
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            isDownloading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 text-white hover:bg-black hover:shadow-lg active:scale-95'
          }`}
        >
          {isDownloading ? (
            <span className="animate-pulse">Packaging...</span>
          ) : (
            <>
              <Download size={16} />
              打包下载
            </>
          )}
        </button>
      </div>

      <div className="p-6 space-y-8 pb-20">
        
        {/* Theme Selection */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
            <Palette size={14} />
            风格选择
          </div>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setConfig({ ...config, themeId: theme.id })}
                className={`relative h-12 rounded-lg text-xs font-medium transition-all duration-200 border-2 flex items-center justify-center overflow-hidden
                  ${config.themeId === theme.id ? 'border-blue-600 ring-2 ring-blue-100 scale-[1.02]' : 'border-transparent hover:border-gray-200'}
                  ${theme.id === 'minimal' ? 'bg-gray-50 text-gray-600' : ''}
                `}
                style={{
                  background: theme.id !== 'minimal' ? undefined : '#f9fafb',
                  color: theme.id === 'minimal' ? undefined : (theme.id === 'geek' || theme.id === 'cinematic' || theme.id === 'tech' ? 'white' : 'black')
                }}
              >
                {/* Background Preview */}
                 <div className={`absolute inset-0 opacity-80 ${theme.bgGradient} -z-10`} />
                 {theme.name}
              </button>
            ))}
          </div>
        </section>

        {/* Appearance Tuning */}
        <section className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
             <Type size={14} />
             外观微调
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">标题字号</label>
                <span className="text-xs text-gray-400">{config.titleSize}px</span>
              </div>
              <input
                type="range"
                min="20"
                max="64"
                value={config.titleSize}
                onChange={(e) => setConfig({ ...config, titleSize: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">正文字号</label>
                <span className="text-xs text-gray-400">{config.bodySize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                value={config.bodySize}
                onChange={(e) => setConfig({ ...config, bodySize: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
               <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">背景色</label>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1.5">
                    <input 
                      type="color" 
                      className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                      value={config.customBgColor || '#ffffff'}
                      onChange={(e) => setConfig({...config, customBgColor: e.target.value})}
                    />
                    <span className="text-xs text-gray-400">自定义</span>
                  </div>
               </div>
               <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">文字色</label>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1.5">
                    <input 
                      type="color" 
                      className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                      value={config.customTextColor || '#000000'}
                      onChange={(e) => setConfig({...config, customTextColor: e.target.value})}
                    />
                    <span className="text-xs text-gray-400">自定义</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
            <ImageIcon size={14} />
            封面配图
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 h-10 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ImageIcon size={16} className="mr-2 text-gray-400" />
                上传图片
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
              {config.coverImage && (
                <button 
                  onClick={() => setConfig({...config, coverImage: null})}
                  className="w-10 h-10 border border-red-100 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            {config.coverImage && (
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600">遮罩浓度</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.overlayOpacity}
                  onChange={(e) => setConfig({ ...config, overlayOpacity: Number(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </div>
        </section>

        {/* Content Editor */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
            <Settings size={14} />
            内容编辑
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">主标题</label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                placeholder="输入大标题"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">期数/日期</label>
                <input
                  type="text"
                  value={content.subtitle}
                  onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VOL.01"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">标签/作者</label>
                <input
                  type="text"
                  value={content.tag}
                  onChange={(e) => setContent({ ...content, tag: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="作者名"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">正文内容 (自动分页)</label>
              <textarea
                value={content.body}
                onChange={(e) => setContent({ ...content, body: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
                placeholder="在此输入正文..."
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
