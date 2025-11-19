
import React from 'react';
import { ProfileData, ThemeConfig } from '../types';
import { THEMES } from '../constants';
import { getIcon } from './Icons';

interface PhonePreviewProps {
  profile: ProfileData;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ profile }) => {
  const theme = THEMES.find(t => t.id === profile.themeId) || THEMES[0];
  const fontClass = theme.font === 'serif' ? 'font-serif' : 'font-sans';
  
  // Calculate styles for background image if present
  const containerStyle = profile.bgImage 
    ? { backgroundImage: `url(${profile.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : {};
    
  const bgClass = profile.bgImage ? 'bg-no-repeat' : theme.bgClass;

  // Simple scoping for preview to prevent body styles from breaking the editor
  const scopedCss = profile.customCss 
    ? profile.customCss.replace(/body/g, '#preview-root') 
    : '';

  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] sm:w-[340px] shadow-xl overflow-hidden">
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
      
      {/* Inject Custom CSS */}
      {scopedCss && (
        <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      )}

      <div 
        id="preview-root"
        className={`w-full h-full overflow-y-auto no-scrollbar ${bgClass} ${theme.textClass} ${fontClass}`}
        style={containerStyle}
      >
        <div className={`px-6 py-12 flex flex-col items-center min-h-full ${profile.bgImage ? 'backdrop-blur-sm bg-black/10' : ''}`}>
          {/* Avatar */}
          <div className="mb-6 relative group bio-avatar">
            <div className={`w-24 h-24 rounded-full overflow-hidden ring-4 ring-opacity-20 ${theme.textClass === 'text-white' ? 'ring-white' : 'ring-black'}`}>
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Header Info */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2 bio-name">{profile.name}</h1>
            <p className="text-sm opacity-80 leading-relaxed max-w-[250px] mx-auto bio-description">
              {profile.bio}
            </p>
          </div>

          {/* Links */}
          <div className="w-full space-y-3 flex-1 bio-links">
            {profile.links.filter(l => l.isActive).map((link) => {
              const customStyle = {
                ...(link.bgColor ? { backgroundColor: link.bgColor, borderColor: link.bgColor } : {}),
                ...(link.textColor ? { color: link.textColor } : {}),
              };

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={customStyle}
                  className={`
                    block w-full px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-between group bio-link-item
                    ${theme.cardBgClass} 
                    ${!link.bgColor ? theme.cardHoverClass : 'hover:brightness-105'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`transition-opacity bio-link-icon ${link.textColor ? '' : 'opacity-70 group-hover:opacity-100'}`}>
                      {getIcon(link.icon)}
                    </span>
                    <span className="font-medium text-sm bio-link-text">{link.title}</span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Footer Branding */}
          {profile.customFooterText && (
            <div className="mt-8 pt-4 opacity-40 text-[10px] uppercase tracking-widest font-semibold bio-footer">
              {profile.customFooterText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
