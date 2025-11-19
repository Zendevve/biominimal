import React, { useState } from 'react';
import { Plus, Layout, BarChart3, Settings, Trash2, GripVertical, ArrowLeft, Check, ExternalLink, Palette, Share2 } from 'lucide-react';
import { ProfileData, LinkItem, ViewMode } from './types';
import { INITIAL_PROFILE, THEMES } from './constants';
import { PhonePreview } from './components/PhonePreview';
import { getIcon } from './components/Icons';
import { AnalyticsChart } from './components/AnalyticsChart';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [activeTab, setActiveTab] = useState<'links' | 'appearance' | 'stats'>('links');

  // --- Actions ---

  const handleUpdateField = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: 'New Link',
      url: 'https://',
      icon: 'generic',
      isActive: true,
      clicks: 0
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

  const handlePublish = () => {
    alert("In a real app, this would deploy your site to biominimal.cc/" + profile.name.toLowerCase().replace(/\s/g, ''));
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
            <span className="text-gray-400">distilled.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            The link-in-bio tool that respects your time and your aesthetic. 
            Zero clutter, zero loading spinners, pure function.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setViewMode('editor')}
              className="bg-black text-white text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform duration-200 font-medium shadow-xl shadow-gray-200"
            >
              Create your page for free
            </button>
            <button className="bg-gray-100 text-gray-900 text-lg px-8 py-4 rounded-full hover:bg-gray-200 transition-colors font-medium">
              View Examples
            </button>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Minimalist Design</h3>
              <p className="text-gray-600 text-sm">Templates designed to get out of the way. Focus on your content, not our branding.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Privacy-First Analytics</h3>
              <p className="text-gray-600 text-sm">See what matters without tracking your visitors across the internet.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <ExternalLink className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Own Your Traffic</h3>
              <p className="text-gray-600 text-sm">No walled gardens. Link anywhere. Integrate with your favorite tools seamlessly.</p>
            </div>
          </div>
        </main>

        <footer className="border-t border-gray-100 py-12 text-center text-gray-400 text-sm">
          © 2024 BioMinimal Inc.
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
            onClick={handlePublish}
            className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Publish <Share2 className="w-3 h-3" />
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
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'stats' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Stats
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          
          {activeTab === 'links' && (
            <>
              {/* Profile Section */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Profile</h3>
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden shrink-0 border border-gray-200 relative group cursor-pointer">
                    <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                      Change
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
                      
                      {/* Expanded Edit State (Always expanded for simplicity in this demo) */}
                      <div className="pl-7 space-y-2">
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
                             <select 
                                value={link.icon}
                                onChange={(e) => handleUpdateLink(link.id, 'icon', e.target.value)}
                                className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none"
                              >
                                <option value="generic">🌐</option>
                                <option value="twitter">🐦</option>
                                <option value="instagram">📷</option>
                                <option value="github">💻</option>
                                <option value="linkedin">💼</option>
                                <option value="youtube">▶️</option>
                                <option value="mail">✉️</option>
                             </select>
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
            <section className="space-y-6">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Themes</h3>
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

              <div className="p-4 bg-blue-50 rounded-xl text-blue-800 text-sm leading-relaxed">
                <p><strong>Pro Tip:</strong> Keep your design simple. High contrast text ensures accessibility for all users.</p>
              </div>
            </section>
          )}

          {activeTab === 'stats' && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Overview</h3>
                 <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                 </select>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                 <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900">1,480</div>
                    <div className="text-sm text-gray-500">Total Views</div>
                 </div>
                 <AnalyticsChart />
              </div>

              <div className="space-y-2">
                 <h4 className="font-semibold text-sm text-gray-700">Top Links</h4>
                 {profile.links.slice(0, 3).map((link, idx) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gray-400 w-4">0{idx + 1}</span>
                          <span className="text-sm font-medium text-gray-700">{link.title}</span>
                       </div>
                       <span className="text-xs font-bold text-gray-900">{link.clicks} clicks</span>
                    </div>
                 ))}
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
