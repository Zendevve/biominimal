export type LinkItem = {
  id: string;
  title: string;
  url: string;
  icon: 'generic' | 'twitter' | 'instagram' | 'github' | 'linkedin' | 'youtube' | 'mail';
  isActive: boolean;
  clicks: number;
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
};

export type ViewMode = 'landing' | 'editor' | 'preview';
