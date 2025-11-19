
import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Plus, Layout, Settings, Trash2, GripVertical, ArrowLeft, Download, Twitter, Instagram, Github, Globe, Image as ImageIcon, Code, Palette } from 'lucide-react';
import { ProfileData, LinkItem, ViewMode } from './types';
import { INITIAL_PROFILE, THEMES } from './constants';
import { PhonePreview } from './components/PhonePreview';
import { IconSelector } from './components/IconSelector';
import { getIcon } from './components/Icons';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [activeTab, setActiveTab] = useState<'links' | 'appearance' | 'settings'>('links');

  // --- Actions ---

  const handleUpdateField = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: 'New Link',
      url: 'https://',
      icon: 'globe',
      isActive: true
    };
    setProfile(prev => ({ ...prev, links: [...prev.links, newLink] }));
  };

  const handleUpdateLink = (id: string, field: keyof LinkItem, value: any) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  const handleDeleteLink = (id: string) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.filter(l => l.id !== id)
    }));
  };

  const handleExport = () => {
    const theme = THEMES.find(t => t.id === profile.themeId) || THEMES[0];
    
    const linksHtml = profile.links.filter(l => l.isActive).map(link => {
        // Render the icon to a static SVG string
        const iconSvg = renderToStaticMarkup(getIcon(link.icon, "w-5 h-5"));
        
        // Construct custom styles
        let styleAttr = '';
        if (link.bgColor || link.textColor) {
            const styles = [];
            if (link.bgColor) {
                styles.push(`background-color: ${link.bgColor}`);
                styles.push(`border-color: ${link.bgColor}`);
            }
            if (link.textColor) styles.push(`color: ${link.textColor}`);
            styleAttr = `style="${styles.join('; ')}"`;
        }

        // Determine hover class based on whether custom bg is present
        const hoverClass = !link.bgColor ? theme.cardHoverClass : 'hover:brightness-105';
        const iconOpacityClass = link.textColor ? '' : 'opacity-70 group-hover:opacity-100';

        return `
          <a href="${link.url}" target="_blank" rel="noreferrer" ${styleAttr} class="block w-full px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-between group bio-link-item ${theme.cardBgClass} ${hoverClass}">
            <div class="flex items-center gap-3">
              <span class="transition-opacity bio-link-icon ${iconOpacityClass}">
                ${iconSvg}
              </span>
              <span class="font-medium text-sm bio-link-text">${link.title}</span>
            </div>
          </a>
        `;
    }).join('');

    // Handle Background Image vs Theme Color
    const bodyStyle = profile.bgImage 
        ? `style="background-image: url('${profile.bgImage}'); background-size: cover; background-position: center;"` 
        : '';
    const bodyClass = profile.bgImage 
        ? `${theme.textClass} ${theme.font === 'serif' ? 'font-serif' : 'font-sans'} min-h-screen flex flex-col` 
        : `${theme.bgClass} ${theme.textClass} ${theme.font === 'serif' ? 'font-serif' : 'font-sans'} min-h-screen flex flex-col`;

    const overlayClass = profile.bgImage ? 'backdrop-blur-sm bg-black/10' : '';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.metaTitle || profile.name}</title>
    <meta name="description" content="${profile.metaDescription || profile.bio}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <style>
      ${profile.customCss || ''}
    </style>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              serif: ['Newsreader', 'serif'],
            },
          }
        }
      }
    </script>
</head>
<body class="${bodyClass}" ${bodyStyle}>
    <div class="max-w-md mx-auto w-full px-6 py-12 flex flex-col items-center flex-1 ${overlayClass}">
        <!-- Avatar -->
        <div class="mb-6 relative group bio-avatar">
            <div class="w-24 h-24 rounded-full overflow-hidden ring-4 ring-opacity-20 ${theme.textClass === 'text-white' ? 'ring-white' : 'ring-black'}">
                <img src="${profile.avatarUrl}" alt="${profile.name}" class="w-full h-full object-cover" />
            </div>
        </div>

        <!-- Header Info -->
        <div class="text-center mb-8">
            <h1 class="text-2xl font-bold tracking-tight mb-2 bio-name">${profile.name}</h1>
            <p class="text-sm opacity-80 leading-relaxed max-w-[250px] mx-auto bio-description">
                ${profile.bio}
            </p>
        </div>

        <!-- Links -->
        <div class="w-full space-y-3 flex-1 bio-links">
            ${linksHtml}
        </div>

        <!-- Footer -->
        ${profile.customFooterText ? `
        <div class="mt-8 pt-4 opacity-40 text-[10px] uppercase tracking-widest font-semibold bio-footer">
            ${profile.customFooterText}
        </div>
        ` : ''}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert("Export complete! \n\nYour 'index.html' file is ready. You can upload this directly to GitHub Pages, Netlify, Vercel, or any standard web host.");
  };

  // --- Views ---

  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-white">
        <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter">BioMinimal.</div>
          <div className="flex gap-6 text-sm font-medium text-gray-600 items-center">
            <a href="#" className="hover:text-black">Templates</a>
            <a href="#" className="hover:text-black">Pricing</a>
            <button className="text-black hover:underline">Login</button>
            <button 
              onClick={() => setViewMode('editor')}
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Start Building
            </button>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-gray-900">
            Your digital identity,<br />
            <span className="text-gray-400">self-hosted.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create a beautiful, fast link-in-bio page. Export as a single HTML file. 
            Host it on GitHub, Netlify, or your own domain. Free forever.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setViewMode('editor')}
              className="bg-black text-white text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform duration-200 font-medium shadow-xl shadow-gray-200"
            >
              Create Page
            </button>
            <button className="bg-gray-100 text-gray-900 text-lg px-8 py-4 rounded-full hover:bg-gray-200 transition-colors font-medium">
              Learn More
            </button>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Pure HTML</h3>
              <p className="text-gray-600 text-sm">No databases, no logins for your visitors. Just a fast, lightweight static file.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Total Control</h3>
              <p className="text-gray-600 text-sm">You own the code. Edit the generated HTML manually if you want to tweak every pixel.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">SEO Ready</h3>
              <p className="text-gray-600 text-sm">Customize meta tags and descriptions to look great on search engines and social previews.</p>
            </div>
          </div>
        </main>

        <footer className="border-t border-gray-100 py-12 flex flex-col items-center gap-8">
          <div className="flex gap-8 text-gray-400">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors transform hover:scale-110 duration-200">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors transform hover:scale-110 duration-200">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors transform hover:scale-110 duration-200">
              <Github className="w-5 h-5" />
            </a>
          </div>
          <div className="text-center text-gray-400 text-sm">
            © 2024 BioMinimal Inc. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }

  // --- Editor Layout ---

  return (
    <div className="h-screen flex flex-col md:flex-row bg-canvas overflow-hidden">
      
      {/* Left Sidebar (Editor Controls) */}
      <div className="w-full md:w-[450px] bg-white border-r border-gray-200 flex flex-col h-full z-20 shadow-xl md:shadow-none">
        
        {/* Toolbar Header */}
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setViewMode('landing')}>
            <div className="bg-black text-white p-1 rounded-md group-hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">BioMinimal</span>
          </div>
          <button 
            onClick={handleExport}
            className="text-sm font-medium bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
            title="Download HTML file"
          >
            Export <Download className="w-3 h-3" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('links')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'links' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Content
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'appearance' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Design
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'settings' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 pb-24">
          
          {activeTab === 'links' && (
            <>
              {/* Profile Section */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Profile</h3>
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden shrink-0 border border-gray-200 relative group cursor-pointer">
                    <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                      URL
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => handleUpdateField('name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
                      placeholder="Your Name"
                    />
                    <textarea 
                      value={profile.bio}
                      onChange={(e) => handleUpdateField('bio', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-black/10"
                      placeholder="Short bio..."
                    />
                    <input 
                      type="text" 
                      value={profile.avatarUrl}
                      onChange={(e) => handleUpdateField('avatarUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/10"
                      placeholder="Avatar Image URL"
                    />
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Links Section */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Links</h3>
                  <button 
                    onClick={handleAddLink}
                    className="text-xs flex items-center gap-1 bg-black text-white px-2 py-1 rounded hover:bg-gray-800"
                  >
                    <Plus className="w-3 h-3" /> Add Link
                  </button>
                </div>

                <div className="space-y-3">
                  {profile.links.map((link) => (
                    <div key={link.id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm group hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="cursor-move text-gray-300 hover:text-gray-600">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="flex-1 font-semibold text-sm text-gray-800">
                          {link.title || 'Untitled Link'}
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpdateLink(link.id, 'isActive', !link.isActive)}
                            className={`w-8 h-4 rounded-full relative transition-colors ${link.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                          >
                            <div className={`w-2 h-2 bg-white rounded-full absolute top-1 transition-all ${link.isActive ? 'left-5' : 'left-1'}`} />
                          </button>
                          <button 
                            onClick={() => handleDeleteLink(link.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded Edit State */}
                      <div className="pl-7 space-y-3">
                         <input 
                            type="text" 
                            value={link.title}
                            onChange={(e) => handleUpdateLink(link.id, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors"
                            placeholder="Link Title"
                          />
                          <div className="flex gap-2">
                             <div className="relative flex-1">
                                <input 
                                  type="text" 
                                  value={link.url}
                                  onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors text-gray-600"
                                  placeholder="https://..."
                                />
                             </div>
                             <div className="w-[140px]">
                                <IconSelector 
                                    value={link.icon}
                                    onChange={(val) => handleUpdateLink(link.id, 'icon', val)}
                                />
                             </div>
                          </div>

                          {/* Link Styling */}
                          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex gap-4">
                              <div className="flex-1">
                                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Background</label>
                                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-1 pl-2">
                                      <div className="relative w-5 h-5 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                                        <input 
                                            type="color" 
                                            value={link.bgColor || '#ffffff'}
                                            onChange={(e) => handleUpdateLink(link.id, 'bgColor', e.target.value)}
                                            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0 opacity-0"
                                        />
                                        <div className="w-full h-full" style={{ backgroundColor: link.bgColor || 'transparent' }} />
                                      </div>
                                      <input 
                                          type="text"
                                          value={link.bgColor || ''}
                                          onChange={(e) => handleUpdateLink(link.id, 'bgColor', e.target.value)}
                                          placeholder="Default"
                                          className="w-full text-xs outline-none text-gray-600 bg-transparent"
                                      />
                                      {link.bgColor && (
                                        <button onClick={() => handleUpdateLink(link.id, 'bgColor', '')} className="text-gray-400 hover:text-red-500">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Text</label>
                                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-1 pl-2">
                                      <div className="relative w-5 h-5 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                                        <input 
                                            type="color" 
                                            value={link.textColor || '#000000'}
                                            onChange={(e) => handleUpdateLink(link.id, 'textColor', e.target.value)}
                                            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0 opacity-0"
                                        />
                                        <div className="w-full h-full" style={{ backgroundColor: link.textColor || 'transparent' }} />
                                      </div>
                                      <input 
                                          type="text"
                                          value={link.textColor || ''}
                                          onChange={(e) => handleUpdateLink(link.id, 'textColor', e.target.value)}
                                          placeholder="Default"
                                          className="w-full text-xs outline-none text-gray-600 bg-transparent"
                                      />
                                      {link.textColor && (
                                        <button onClick={() => handleUpdateLink(link.id, 'textColor', '')} className="text-gray-400 hover:text-red-500">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </div>
                    </div>
                  ))}
                  
                  {profile.links.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                      No links yet. Add one to get started!
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {activeTab === 'appearance' && (
            <section className="space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">Themes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => handleUpdateField('themeId', theme.id)}
                      className={`
                        relative h-24 rounded-xl border-2 transition-all overflow-hidden text-left p-3 flex flex-col justify-end
                        ${profile.themeId === theme.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:scale-[1.02]'}
                      `}
                    >
                      {/* Theme Preview Background */}
                      <div className={`absolute inset-0 ${theme.bgClass}`}></div>
                      
                      {/* Theme Content Preview */}
                      <div className={`relative z-10 ${theme.textClass} font-bold text-sm flex items-center gap-2`}>
                        {profile.themeId === theme.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        {theme.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                 <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">Custom Background</h3>
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <ImageIcon className="w-4 h-4" />
                      <span>Background Image URL</span>
                    </div>
                    <input 
                      type="text" 
                      value={profile.bgImage || ''}
                      onChange={(e) => handleUpdateField('bgImage', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                    <p className="text-xs text-gray-500">Provide a direct URL to an image to override the theme background.</p>
                 </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">Custom CSS</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                   <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Code className="w-4 h-4" />
                      <span>CSS Overrides</span>
                   </div>
                   <textarea
                      value={profile.customCss || ''}
                      onChange={(e) => handleUpdateField('customCss', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 text-green-400 font-mono text-xs rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 h-32"
                      placeholder="body { background: #000; }&#10;.bio-avatar { border-radius: 0; }"
                    />
                   <div className="text-[10px] text-gray-500 space-y-1">
                      <p>Available classes:</p>
                      <div className="flex flex-wrap gap-1">
                         <code className="bg-gray-100 px-1 rounded">.bio-avatar</code>
                         <code className="bg-gray-100 px-1 rounded">.bio-name</code>
                         <code className="bg-gray-100 px-1 rounded">.bio-description</code>
                         <code className="bg-gray-100 px-1 rounded">.bio-links</code>
                         <code className="bg-gray-100 px-1 rounded">.bio-link-item</code>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="space-y-6">
              <div className="p-4 bg-purple-50 rounded-xl text-purple-900 text-sm leading-relaxed mb-6">
                These settings control how your site looks on Google and when shared on social media.
              </div>

              <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Meta Title (SEO)</label>
                   <input 
                      type="text" 
                      value={profile.metaTitle || ''}
                      onChange={(e) => handleUpdateField('metaTitle', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                      placeholder={profile.name}
                    />
                 </div>

                 <div>
                   <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Meta Description</label>
                   <textarea 
                      value={profile.metaDescription || ''}
                      onChange={(e) => handleUpdateField('metaDescription', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-black/10"
                      placeholder={profile.bio}
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">Recommended: 150-160 characters</p>
                 </div>

                 <div>
                   <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Footer Text</label>
                   <input 
                      type="text" 
                      value={profile.customFooterText || ''}
                      onChange={(e) => handleUpdateField('customFooterText', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                      placeholder="Made with BioMinimal"
                    />
                 </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Main Stage (Right Side - Preview) */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center relative overflow-hidden p-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
           <PhonePreview profile={profile} />
           <div className="text-center mt-8 text-gray-400 text-sm font-medium flex items-center justify-center gap-2">
             <Layout className="w-4 h-4" /> Live Preview
           </div>
        </div>
      </div>

    </div>
  );
}

export default App;
