import React from 'react';
import { Globe, Twitter, Instagram, Github, Linkedin, Youtube, Mail } from 'lucide-react';

export const getIcon = (type: string, className?: string) => {
  const props = { className: className || "w-5 h-5" };
  switch (type) {
    case 'twitter': return <Twitter {...props} />;
    case 'instagram': return <Instagram {...props} />;
    case 'github': return <Github {...props} />;
    case 'linkedin': return <Linkedin {...props} />;
    case 'youtube': return <Youtube {...props} />;
    case 'mail': return <Mail {...props} />;
    default: return <Globe {...props} />;
  }
};
