import { ProfileData, ThemeConfig } from './types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'minimal-light',
    name: 'Paper',
    bgClass: 'bg-[#F3F4F6]',
    textClass: 'text-gray-900',
    cardBgClass: 'bg-white shadow-sm border border-gray-200',
    cardHoverClass: 'hover:shadow-md hover:-translate-y-0.5',
    buttonClass: 'bg-black text-white hover:bg-gray-800',
    font: 'sans',
  },
  {
    id: 'minimal-dark',
    name: 'Obsidian',
    bgClass: 'bg-[#0f0f0f]',
    textClass: 'text-white',
    cardBgClass: 'bg-[#1a1a1a] border border-[#333]',
    cardHoverClass: 'hover:bg-[#252525]',
    buttonClass: 'bg-white text-black hover:bg-gray-200',
    font: 'sans',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    bgClass: 'bg-[#e8e6e1]',
    textClass: 'text-[#2c2b28]',
    cardBgClass: 'bg-[#f4f3f0] border border-[#dcdad5]',
    cardHoverClass: 'hover:bg-[#fff]',
    buttonClass: 'bg-[#bc4a3c] text-white',
    font: 'serif',
  },
  {
    id: 'hyper-blue',
    name: 'Electric',
    bgClass: 'bg-blue-600',
    textClass: 'text-white',
    cardBgClass: 'bg-blue-700/50 backdrop-blur-md border border-blue-500/50',
    cardHoverClass: 'hover:bg-blue-700/80',
    buttonClass: 'bg-white text-blue-600',
    font: 'sans',
  },
];

export const INITIAL_PROFILE: ProfileData = {
  name: 'Alex Creator',
  bio: 'Digital minimalist. Building things for the web. Exploring the intersection of design and code.',
  avatarUrl: 'https://picsum.photos/200/200',
  themeId: 'minimal-light',
  links: [
    { id: '1', title: 'Latest Project', url: '#', icon: 'generic', isActive: true },
    { id: '2', title: 'Twitter', url: '#', icon: 'twitter', isActive: true },
    { id: '3', title: 'Instagram', url: '#', icon: 'instagram', isActive: true },
    { id: '4', title: 'Contact Me', url: 'mailto:hello@example.com', icon: 'mail', isActive: true },
  ],
  metaTitle: 'Alex Creator | Links',
  metaDescription: 'Welcome to my personal page. Check out my latest projects and social links.',
  customFooterText: 'Made with BioMinimal',
  bgImage: '',
};