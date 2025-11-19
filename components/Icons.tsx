import React from 'react';
import {
  Globe, Twitter, Instagram, Github, Linkedin, Youtube, Mail,
  Facebook, Twitch, Music, Video, ShoppingBag, DollarSign,
  Calendar, MapPin, Smartphone, Link, MessageCircle, Send,
  Coffee, Star, Heart, Code, Briefcase, User
} from 'lucide-react';

export const ICON_OPTIONS = [
  { value: 'globe', label: 'Website', component: Globe },
  { value: 'twitter', label: 'Twitter', component: Twitter },
  { value: 'instagram', label: 'Instagram', component: Instagram },
  { value: 'github', label: 'GitHub', component: Github },
  { value: 'linkedin', label: 'LinkedIn', component: Linkedin },
  { value: 'youtube', label: 'YouTube', component: Youtube },
  { value: 'mail', label: 'Email', component: Mail },
  { value: 'facebook', label: 'Facebook', component: Facebook },
  { value: 'twitch', label: 'Twitch', component: Twitch },
  { value: 'music', label: 'Music', component: Music },
  { value: 'video', label: 'Video', component: Video },
  { value: 'shopping-bag', label: 'Shop', component: ShoppingBag },
  { value: 'dollar-sign', label: 'Money/Tip', component: DollarSign },
  { value: 'calendar', label: 'Calendar', component: Calendar },
  { value: 'map-pin', label: 'Location', component: MapPin },
  { value: 'smartphone', label: 'App', component: Smartphone },
  { value: 'link', label: 'Link', component: Link },
  { value: 'message-circle', label: 'Chat/Discord', component: MessageCircle },
  { value: 'send', label: 'Telegram', component: Send },
  { value: 'coffee', label: 'Coffee', component: Coffee },
  { value: 'star', label: 'Star', component: Star },
  { value: 'heart', label: 'Heart', component: Heart },
  { value: 'code', label: 'Code', component: Code },
  { value: 'briefcase', label: 'Work', component: Briefcase },
  { value: 'user', label: 'Personal', component: User },
];

export const getIcon = (type: string, className?: string) => {
  const props = { className: className || "w-5 h-5" };
  const icon = ICON_OPTIONS.find(i => i.value === type);
  if (icon) {
    const IconComponent = icon.component;
    return <IconComponent {...props} />;
  }
  // Fallback
  return <Globe {...props} />;
};