
import React from 'react';
import { ProfileData, DeviceMode } from '../types';
import { THEMES } from '../constants';
import { getIcon } from './Icons';

interface DevicePreviewProps {
  profile: ProfileData;
  mode?: DeviceMode;
  rotated?: boolean;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({ profile, mode = 'mobile', rotated = false }) => {
  const theme = THEMES.find(t => t.id === profile.themeId) || THEMES[0];
  const fontClass = theme.font === 'serif' ? 'font-serif' : 'font-sans';
  
  // Calculate styles for background image if present
  const containerStyle = profile.bgImage 
    ? { backgroundImage: `url(${profile.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } 
    : {};
    
  const bgClass = profile.bgImage ? 'bg-no-repeat' : theme.bgClass;

  // Simple scoping for preview to prevent body styles from breaking the editor
  const scopedCss = profile.customCss 
    ? profile.customCss.replace(/body/g, '#preview-root') 
    : '';

  // Frame Dimensions based on mode - Optimized to fit in viewport
  const getFrameStyles = () => {
    if (mode === 'desktop') {
        return 'w-full h-full border-[8px] rounded-lg max-w-[1024px] max-h-[85vh]';
    }

    if (rotated) {
        // Landscape Orientation
        if (mode === 'mobile') {
            return 'w-[640px] max-w-[85vw] aspect-[19/9] h-auto border-[14px] rounded-[2.5rem]';
        }
        if (mode === 'tablet') {
            return 'w-[800px] max-w-[85vw] aspect-[4/3] h-auto border-[12px] rounded-[1.5rem]';
        }
    }

    // Portrait Orientation (Default)
    switch (mode) {
      case 'mobile':
        return 'h-[640px] max-h-[80vh] aspect-[9/19] w-auto border-[14px] rounded-[2.5rem]';
      case 'tablet':
        return 'h-[800px] max-h-[85vh] aspect-[3/4] w-auto border-[12px] rounded-[1.5rem]';
      default:
        return 'h-[640px] max-h-[80vh] aspect-[9/19] w-auto border-[14px] rounded-[2.5rem]';
    }
  };

  return (
    <div className={`relative mx-auto transition-all duration-500 ease-in-out bg-gray-900 border-gray-900 shadow-2xl overflow-hidden flex flex-col ${getFrameStyles()}`}>
      
      {/* Mobile Hardware Buttons (Only show on mobile portrait mode) */}
      {mode === 'mobile' && !rotated && (
        <>
          <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
          <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
        </>
      )}

      {/* Desktop Browser Header */}
      {mode === 'desktop' && (
        <div className="bg-gray-100 h-9 w-full flex items-center px-4 gap-2 border-b border-gray-200 shrink-0">
          <div className="flex gap-1.5">
             <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors" />
             <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors" />
             <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors" />
          </div>
          <div className="ml-4 bg-white rounded-md text-[10px] text-gray-400 px-3 py-1 flex-1 text-center font-medium border border-gray-200">
             {window.location.hostname}/{profile.name.toLowerCase().replace(/\s/g, '')}
          </div>
        </div>
      )}
      
      {/* Inject Custom CSS */}
      {scopedCss && (
        <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      )}

      {/* Screen Content */}
      <div 
        id="preview-root"
        className={`w-full h-full overflow-y-auto scrollbar-hide ${bgClass} ${theme.textClass} ${fontClass}`}
        style={containerStyle}
      >
        {/* Content Container (matches export max-w-md) */}
        <div className={`mx-auto w-full flex flex-col min-h-full ${mode === 'desktop' ? 'max-w-md shadow-2xl my-8' : ''} ${profile.bgImage ? 'backdrop-blur-sm bg-black/10' : ''}`}>
            
            <div className="px-6 py-12 flex flex-col items-center flex-1">
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
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight mb-2 bio-name">{profile.name}</h1>
                <p className="text-sm opacity-80 leading-relaxed max-w-[250px] mx-auto bio-description">
                  {profile.bio}
                </p>
              </div>

              {/* Social Icons Row */}
              {profile.socials.length > 0 && (
                <div className="flex gap-4 justify-center mb-8 flex-wrap bio-socials">
                  {profile.socials.map(social => (
                    <a 
                      key={social.id} 
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`opacity-70 hover:opacity-100 transition-opacity transform hover:scale-110 duration-200`}
                    >
                      {getIcon(social.platform, "w-6 h-6")}
                    </a>
                  ))}
                </div>
              )}

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
    </div>
  );
};
