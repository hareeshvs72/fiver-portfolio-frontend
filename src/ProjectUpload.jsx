import React, { useState, useRef } from 'react';
import { 
  Upload, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  LayoutDashboard, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Github
} from 'lucide-react';

const ProjectUpload = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    liveUrl: '',
    codeUrl: '',
    image: null,
    imagePreview: null,
  });

  const [currentTag, setCurrentTag] = useState('');

  /* ---------------- IMAGE HANDLING ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData(prev => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  /* ------------------------------------------------ */

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()],
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-6 md:p-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
            Back to Portfolio
          </button>

          <div className="flex items-center gap-3 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
            <LayoutDashboard size={16} className="text-cyan-400" />
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono">
              Admin Dashboard
            </span>
          </div>
        </div>

        {step < 3 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* FORM */}
            <div className="lg:col-span-7 xl:col-span-8">
              <h1 className="text-3xl sm:text-4xl font-black mb-2">
                Upload New Project
              </h1>
              <p className="text-gray-500 mb-8">
                Fill in the details to expand your digital gallery.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* IMAGE UPLOAD */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
                    Project Cover Image
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div
                    onClick={triggerFileInput}
                    className="w-full h-56 sm:h-64 rounded-xl sm:rounded-2xl
                               border-2 border-dashed border-white/10
                               bg-white/5 hover:border-white/20
                               flex items-center justify-center
                               cursor-pointer transition-all overflow-hidden"
                  >
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={22} className="text-cyan-400" />
                        <span className="text-[10px] font-mono uppercase text-gray-400">
                          Click to upload image
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* TITLE */}
                <input
                  type="text"
                  required
                  placeholder="Project Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-6 py-4"
                />

                {/* DESCRIPTION */}
                <textarea
                  rows="4"
                  required
                  placeholder="Describe the core features..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-6 py-4 resize-none"
                />

                {/* TAGS */}
                <input
                  type="text"
                  placeholder="Technologies (Press Enter)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagAdd}
                  className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-6 py-4"
                />

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-400"
                    >
                      {tag}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </span>
                  ))}
                </div>

                {/* LINKS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="url"
                      placeholder="Live Demo URL"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4"
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, liveUrl: e.target.value }))
                      }
                    />
                  </div>

                  <div className="relative">
                    <Github size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="url"
                      placeholder="Source Code URL"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4"
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, codeUrl: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full py-5 bg-white text-black font-black rounded-xl sm:rounded-2xl hover:bg-cyan-400 flex items-center justify-center gap-3"
                >
                  <Upload size={18} />
                  PUBLISH PROJECT
                </button>
              </form>
            </div>

            {/* PREVIEW */}
            <div className="lg:col-span-5 xl:col-span-4">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4 text-center">
                Live Preview Card
              </label>

              <div className="p-2 bg-zinc-900 border border-white/10 rounded-[2.5rem] max-w-sm mx-auto">
                <div className="h-[420px] rounded-[2rem] bg-black overflow-hidden relative">
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-white/5 m-4 rounded-[1.5rem]">
                      <ImageIcon size={40} className="text-white/10 mb-4" />
                      <span className="text-gray-600 text-[10px] font-mono uppercase tracking-widest">
                        No Image Selected
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h3 className="text-2xl font-black uppercase italic truncate mb-2">
                      {formData.title || 'Project Title'}
                    </h3>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {formData.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-[8px] px-2 py-0.5 bg-white/10 rounded-full font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-400 text-xs line-clamp-2">
                      {formData.description || 'Your project description will appear here.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* SUCCESS */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle2 size={56} className="text-cyan-400 mb-6" />
            <h2 className="text-4xl font-black uppercase italic mb-4">
              Live on System!
            </h2>
            <button
              onClick={onBack}
              className="px-10 py-4 bg-white text-black font-black rounded-full"
            >
              Go to Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectUpload;
