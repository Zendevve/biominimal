
export type LinkItem = {
  id: string;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  bgColor?: string;
  textColor?: string;
};

export type ThemeConfig = {
  id: string;
  name: string;
  bgClass: string;
  textClass: string;
  cardBgClass: string;
  cardHoverClass: string;
  buttonClass: string;
  font: 'sans' | 'serif';
};

export type ProfileData = {
  name: string;
  bio: string;
  avatarUrl: string;
  links: LinkItem[];
  themeId: string;
  // Static Site Config
  bgImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  customFooterText?: string;
  customCss?: string;
};

export type ViewMode = 'landing' | 'editor' | 'preview';
