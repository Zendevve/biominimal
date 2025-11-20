
import React, { useState, useRef, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { 
  Plus, Layout, Settings, Trash2, GripVertical, ArrowLeft, Download, 
  Twitter, Instagram, Github, Globe, Image as ImageIcon, Code, Palette, 
  Smartphone, Tablet, Monitor, Eye, EyeOff, Edit3, Upload, X, RotateCw,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { ProfileData, LinkItem, ViewMode, DeviceMode, SocialItem } from './types';
import { INITIAL_PROFILE, THEMES } from './constants';
import { DevicePreview } from './components/PhonePreview';
import { IconSelector } from './components/IconSelector';
import { getIcon } from './components/Icons';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [activeTab, setActiveTab] = useState<'links' | 'appearance' | 'settings'>('links');
  
  // Preview State
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile');
  const [isRotated, setIsRotated] = useState(false);
  const [mobilePreviewActive, setMobilePreviewActive] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Drag & Drop State
  const [draggedLinkIndex, setDraggedLinkIndex] = useState<number | null>(null);

  // File Input Refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Auto-expand sidebar on mobile resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Actions ---

  const handleUpdateField = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'bgImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Link Management
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

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedLinkIndex(index);
    // Set generic drag image or use default
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Essential for allowing drop
    if (draggedLinkIndex === null || draggedLinkIndex === index) return;
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedLinkIndex === null || draggedLinkIndex === dropIndex) return;

    const newLinks = [...profile.links];
    const [draggedItem] = newLinks.splice(draggedLinkIndex, 1);
    newLinks.splice(dropIndex, 0, draggedItem);

    setProfile(prev => ({ ...prev, links: newLinks }));
    setDraggedLinkIndex(null);
  };

  // Social Management
  const handleAddSocial = () => {
    const newSocial: SocialItem = {
      id: Date.now().toString(),
      platform: 'globe',
      url: 'https://'
    };
    setProfile(prev => ({ ...prev, socials: [...prev.socials, newSocial] }));
  };

  const handleUpdateSocial = (id: string, field: keyof SocialItem, value: string) => {
    setProfile(prev => ({
      ...prev,
      socials: prev.socials.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleDeleteSocial = (id: string) => {
    setProfile(prev => ({ ...prev, socials: prev.socials.filter(s => s.id !== id) }));
  };

  const handleExport = () => {
    const theme = THEMES.find(t => t.id === profile.themeId) || THEMES[0];
    
    const linksHtml = profile.links.filter(l => l.isActive).map(link => {
        const iconSvg = renderToStaticMarkup(getIcon(link.icon, "w-5 h-5"));
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

    const socialsHtml = profile.socials.length > 0 ? `
      <div class="flex gap-4 justify-center mb-8 flex-wrap bio-socials">
        ${profile.socials.map(s => `
          <a href="${s.url}" target="_blank" rel="noreferrer" class="opacity-70 hover:opacity-100 transition-opacity transform hover:scale-110 duration-200">
             ${renderToStaticMarkup(getIcon(s.platform, "w-6 h-6"))}
          </a>
        `).join('')}
      </div>
    ` : '';

    // Handle Background Image vs Theme Color
    const bodyStyle = profile.bgImage 
        ? `style="background-image: url('${profile.bgImage}'); background-size: cover; background-position: center; background-attachment: fixed;"` 
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
        <div class="text-center mb-6">
            <h1 class="text-2xl font-bold tracking-tight mb-2 bio-name">${profile.name}</h1>
            <p class="text-sm opacity-80 leading-relaxed max-w-[250px] mx-auto bio-description">
                ${profile.bio}
            </p>
        </div>

        <!-- Socials -->
        ${socialsHtml}

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
            <a href="#" className="hover:text-black hidden sm:block">Templates</a>
            <a href="#" className="hover:text-black hidden sm:block">Pricing</a>
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
    <div className="h-screen flex flex-col md:flex-row bg-canvas overflow-hidden relative">
      
      {/* Left Sidebar (Editor Controls) - Collapsible on Desktop */}
      <div className={`
        bg-white border-r border-gray-200 flex-col h-full z-20 shadow-xl md:shadow-none transition-[width] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
        ${mobilePreviewActive ? 'hidden md:flex' : 'flex'}
        ${isSidebarCollapsed ? 'w-full md:w-[80px]' : 'w-full md:w-[450px]'}
      `}>
        
        {/* Toolbar Header */}
        <div className={`h-16 border-b border-gray-100 flex items-center shrink-0 ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-6'}`}>
          {!isSidebarCollapsed ? (
             <>
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setViewMode('landing')}>
                <div className="bg-black text-white p-1 rounded-md group-hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg tracking-tight">BioMinimal</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                    onClick={handleExport}
                    className="text-sm font-medium bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                    title="Download HTML file"
                >
                    Export <Download className="w-3 h-3" />
                </button>
                <button 
                    onClick={() => setIsSidebarCollapsed(true)} 
                    className="hidden md:block p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                    title="Collapse sidebar"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
             </>
          ) : (
            <button 
                onClick={() => setIsSidebarCollapsed(false)} 
                className="p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                title="Expand sidebar"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed Navigation (Desktop Only) */}
        {isSidebarCollapsed && (
            <div className="hidden md:flex flex-col items-center py-6 gap-6 h-full overflow-y-auto">
                <button
                    onClick={() => setActiveTab('links')}
                    className={`p-3 rounded-xl transition-all ${activeTab === 'links' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:bg-gray-50 hover:text-black'}`}
                    title="Links"
                >
                    <Layout className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setActiveTab('appearance')}
                    className={`p-3 rounded-xl transition-all ${activeTab === 'appearance' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:bg-gray-50 hover:text-black'}`}
                    title="Appearance"
                >
                    <Palette className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:bg-gray-50 hover:text-black'}`}
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>

                <div className="w-8 h-px bg-gray-100 my-2" />

                <button
                    onClick={handleExport}
                    className="p-3 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-black transition-all"
                    title="Export"
                >
                    <Download className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setViewMode('landing')}
                    className="p-3 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-red-500 transition-all mt-auto mb-4"
                    title="Exit"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>
        )}

        {/* Expanded Content Area */}
        <div className={`${isSidebarCollapsed ? 'hidden md:hidden' : 'flex flex-col h-full overflow-hidden'}`}>
            {/* Tabs */}
            <div className="px-6 pt-6 pb-2">
                <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
                    {['links', 'appearance', 'settings'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all capitalize whitespace-nowrap ${activeTab === tab ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab}
                    </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 pb-24 scrollbar-thin scrollbar-thumb-gray-200">
            
            {activeTab === 'links' && (
                <>
                {/* Profile Section */}
                <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Profile</h3>
                    <div className="flex gap-4 items-start">
                    <div className="relative group">
                        <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden shrink-0 border border-gray-200">
                        <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button 
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                        >
                        <Upload className="w-5 h-5 text-white" />
                        </button>
                        <input 
                        type="file" 
                        ref={avatarInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'avatarUrl')}
                        />
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
                    </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Social Icons Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Social Icons</h3>
                    <button 
                        onClick={handleAddSocial}
                        className="text-xs flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                    >
                        <Plus className="w-3 h-3" /> Add Icon
                    </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                    {profile.socials.map((social) => (
                        <div key={social.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <div className="w-[120px]">
                            <IconSelector 
                                value={social.platform}
                                onChange={(val) => handleUpdateSocial(social.id, 'platform', val)}
                            />
                        </div>
                        <input 
                            type="text" 
                            value={social.url}
                            onChange={(e) => handleUpdateSocial(social.id, 'url', e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none min-w-0"
                            placeholder="https://..."
                        />
                        <button 
                            onClick={() => handleDeleteSocial(social.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                        >
                            <X className="w-3 h-3" />
                        </button>
                        </div>
                    ))}
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

                    <div className="space-y-3" onDragOver={(e) => e.preventDefault()}>
                    {profile.links.map((link, index) => (
                        <div 
                        key={link.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`
                            bg-white border border-gray-200 rounded-xl p-3 shadow-sm group hover:border-gray-300 transition-all
                            ${draggedLinkIndex === index ? 'opacity-40 border-dashed border-2 border-gray-400' : ''}
                            ${!link.isActive ? 'opacity-60 grayscale-[0.5]' : ''}
                        `}
                        >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="cursor-move text-gray-300 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                            <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="flex-1 font-semibold text-sm text-gray-800 truncate">
                            {link.title || 'Untitled Link'}
                            </div>
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => handleUpdateLink(link.id, 'isActive', !link.isActive)}
                                    className={`p-2 rounded-lg transition-colors ${link.isActive ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}
                                    title={link.isActive ? "Hide from preview" : "Show in preview"}
                                >
                                    {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button 
                                    onClick={() => handleDeleteLink(link.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                    title="Delete link"
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
                        <span>Background Image</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={profile.bgImage || ''}
                                onChange={(e) => handleUpdateField('bgImage', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                            />
                            <button 
                                onClick={() => bgInputRef.current?.click()}
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <Upload className="w-4 h-4 text-gray-600" />
                            </button>
                            <input 
                                type="file" 
                                ref={bgInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'bgImage')}
                            />
                        </div>
                        <p className="text-xs text-gray-500">Enter a URL or upload a file (converted to base64).</p>
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
                            <code className="bg-gray-100 px-1 rounded">.bio-socials</code>
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
      </div>

      {/* Main Stage (Right Side - Preview) - Hidden on Mobile unless Preview is Active */}
      <div className={`flex-1 bg-gray-100 flex-col items-center justify-center relative overflow-hidden ${mobilePreviewActive ? 'flex' : 'hidden md:flex'}`}>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Device Switcher Toolbar (Visible on large screens or in preview mode) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-full p-1 flex gap-1 z-30">
            <button 
                onClick={() => setDeviceMode('mobile')}
                className={`p-2 rounded-full transition-colors ${deviceMode === 'mobile' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}
                title="Mobile View"
            >
                <Smartphone className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setDeviceMode('tablet')}
                className={`p-2 rounded-full transition-colors ${deviceMode === 'tablet' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}
                title="Tablet View"
            >
                <Tablet className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setDeviceMode('desktop')}
                className={`p-2 rounded-full transition-colors ${deviceMode === 'desktop' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}
                title="Desktop View"
            >
                <Monitor className="w-4 h-4" />
            </button>

            <div className="w-px bg-gray-200 mx-1 my-1" /> {/* Separator */}

            <button 
                onClick={() => setIsRotated(!isRotated)}
                className={`p-2 rounded-full transition-colors ${isRotated ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'} ${deviceMode === 'desktop' ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Rotate Device"
                disabled={deviceMode === 'desktop'}
            >
                <RotateCw className="w-4 h-4" />
            </button>
        </div>

        <div className="relative z-10 w-full h-full overflow-hidden flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16">
           <div className="animate-in fade-in zoom-in duration-300 origin-center w-full h-full flex items-center justify-center">
               <DevicePreview profile={profile} mode={deviceMode} rotated={isRotated} />
           </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl shadow-black/10 rounded-full p-1.5 flex gap-1 z-50 border border-gray-200">
         <button 
            onClick={() => setMobilePreviewActive(false)} 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${!mobilePreviewActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
         >
            <Edit3 className="w-4 h-4" /> Editor
         </button>
         <button 
            onClick={() => setMobilePreviewActive(true)} 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${mobilePreviewActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
         >
            <Eye className="w-4 h-4" /> Preview
         </button>
      </div>

    </div>
  );
}

export default App;
