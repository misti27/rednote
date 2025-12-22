export type FontFamily = 'Inter' | 'Noto Serif SC' | 'Ma Shan Zheng' | 'JetBrains Mono' | string;

export interface AppConfig {
  themeId: string;
  titleSize: number;
  bodySize: number;
  customBgColor: string;
  customTextColor: string;
  customFontFamily?: string; // New field for custom font
  coverImage: string | null;
  overlayOpacity: number;
}

export interface Theme {
  id: string;
  name: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  fontFamily: FontFamily;
  type: 'modern' | 'classic' | 'handwritten' | 'tech';
  // Optional: if this theme is a saved custom one, store the config here
  savedConfig?: Partial<AppConfig>; 
}

export interface ContentData {
  title: string;
  subtitle: string; // Used for Date/Vol
  tag: string; // Used for Author/Tag
  body: string;
}