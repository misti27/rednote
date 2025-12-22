export type FontFamily = 'Inter' | 'Noto Serif SC' | 'Ma Shan Zheng' | 'JetBrains Mono';

export interface Theme {
  id: string;
  name: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  fontFamily: FontFamily;
  type: 'modern' | 'classic' | 'handwritten' | 'tech';
}

export interface AppConfig {
  themeId: string;
  titleSize: number;
  bodySize: number;
  customBgColor: string;
  customTextColor: string;
  coverImage: string | null;
  overlayOpacity: number;
}

export interface ContentData {
  title: string;
  subtitle: string; // Used for Date/Vol
  tag: string; // Used for Author/Tag
  body: string;
}
