import { Theme, ContentData, AppConfig } from './types';

export const THEMES: Theme[] = [
  { 
    id: 'shockwave', 
    name: '⚡️ 冲击波', 
    bgGradient: 'bg-gradient-to-br from-yellow-200 to-green-200', 
    textColor: '#1a1a1a', 
    accentColor: '#000000',
    fontFamily: 'Inter',
    type: 'modern'
  },
  { 
    id: 'diffuse', 
    name: '🌈 弥散光', 
    bgGradient: 'bg-gradient-to-tr from-purple-100 via-pink-100 to-blue-100', 
    textColor: '#4a044e', 
    accentColor: '#db2777',
    fontFamily: 'Inter',
    type: 'modern'
  },
  { 
    id: 'sticker', 
    name: '🍭 贴纸风', 
    bgGradient: 'bg-rose-50', 
    textColor: '#881337', 
    accentColor: '#fb7185',
    fontFamily: 'Inter',
    type: 'modern'
  },
  { 
    id: 'handwritten', 
    name: '📝 手账感', 
    bgGradient: 'bg-orange-50', 
    textColor: '#431407', 
    accentColor: '#ea580c',
    fontFamily: 'Ma Shan Zheng',
    type: 'handwritten'
  },
  { 
    id: 'cinematic', 
    name: '🎬 电影感', 
    bgGradient: 'bg-gray-900', 
    textColor: '#f3f4f6', 
    accentColor: '#fbbf24',
    fontFamily: 'Noto Serif SC',
    type: 'classic'
  },
  { 
    id: 'tech', 
    name: '🔵 科技蓝', 
    bgGradient: 'bg-slate-900', 
    textColor: '#60a5fa', 
    accentColor: '#3b82f6',
    fontFamily: 'JetBrains Mono',
    type: 'tech'
  },
  { 
    id: 'minimal', 
    name: '⚪️ 极简白', 
    bgGradient: 'bg-white', 
    textColor: '#171717', 
    accentColor: '#d4d4d4',
    fontFamily: 'Inter',
    type: 'modern'
  },
  { 
    id: 'memo', 
    name: '🟡 备忘录', 
    bgGradient: 'bg-yellow-100', 
    textColor: '#422006', 
    accentColor: '#ca8a04',
    fontFamily: 'Inter',
    type: 'modern'
  },
  { 
    id: 'geek', 
    name: '🟢 极客黑', 
    bgGradient: 'bg-black', 
    textColor: '#22c55e', 
    accentColor: '#166534',
    fontFamily: 'JetBrains Mono',
    type: 'tech'
  }
];

export const DEFAULT_CONTENT: ContentData = {
  title: '李笑来：最重要的任务永远只有一个',
  subtitle: 'VOL.01 | 2025',
  tag: '超级全！快收藏！',
  body: `第82天 | 李笑来：最重要的任务永远只有一个\n《把时间当作朋友》\n\n判断一件事情是否真的重要，标准只有一个：是否对目标的实现有益。\n\n我们必须学会区分“紧急”和“重要”。大多数人往往被紧急的事情推着走，而忽略了真正重要的事情。\n\n重要的事情通常不紧急，比如读书、健身、学习一项新技能。它们的效果不会立竿见影，但长期坚持会产生复利效应。\n\n专注力是这个时代最稀缺的资源。保护你的专注力，就像保护你的钱包一样。不要让琐事占据你的大脑带宽。\n\n从今天开始，每天早上列出三件最重要的事情，然后优先完成它们。你会发现，效率提升的不仅仅是一点点。\n\n坚持做难而正确的事。`
};

export const DEFAULT_CONFIG: AppConfig = {
  themeId: 'shockwave',
  titleSize: 32,
  bodySize: 16,
  customBgColor: '',
  customTextColor: '',
  coverImage: null,
  overlayOpacity: 0.2,
};
