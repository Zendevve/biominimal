
export type LinkItem = {
  id: string;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  bgColor?: string;
  textColor?: string;
};

export type SocialItem = {
  id: string;
  platform: string; // icon name
  url: string;
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
  socials: SocialItem[];
  themeId: string;
  // Static Site Config
  bgImage?: string;
  socialImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  customFooterText?: string;
  customCss?: string;
};

export type ViewMode = 'landing' | 'editor' | 'preview';
export type DeviceMode = 'mobile' | 'tablet' | 'desktop';