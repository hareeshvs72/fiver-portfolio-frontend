import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  ArrowLeft,
  X,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectUpload = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    liveUrl: "",
    codeUrl: "",
    image: null,
    imagePreview: null,
  });

  const [currentTag, setCurrentTag] = useState("");

  /* ---------------- IMAGE HANDLING ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image");
      return;
    }

    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  useEffect(() => {
    return () => {
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

  const triggerFileInput = () => fileInputRef.current?.click();
  /* ------------------------------------------------ */

  /* ---------------- TAG HANDLING ---------------- */
  const handleTagAdd = (e) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();

      if (!formData.tags.includes(currentTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()],
        }));
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };
  /* --------------------------------------------- */

  /* ---------------- SUBMIT ---------------- */
  const handleUploadProject = async (e) => {
    e.preventDefault();

    const { title, description, tags, liveUrl, codeUrl, image } = formData;

    if (!title || !description || !tags.length || !liveUrl || !codeUrl || !image) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("tags", JSON.stringify(tags));
      form.append("liveUrl", liveUrl);
      form.append("codeUrl", codeUrl);
      form.append("image", image);

      const res = await axios.post(
        "https://fiver-portfolio-backend.onrender.com/api/projects/upload",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Upload success:", res.data);
      setStep(3); // show success screen
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };
  /* --------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-6 md:p-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-10">
          <button
            onClick={()=>navigate('/')}
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
          <form
            onSubmit={handleUploadProject}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* FORM */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl font-black">Upload New Project</h1>

              {/* IMAGE */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              <div
                onClick={triggerFileInput}
                className="h-60 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer"
              >
                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <Upload className="text-cyan-400" />
                )}
              </div>

              <input
                placeholder="Project Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                className="w-full bg-white/5 p-4 rounded-xl"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                className="w-full bg-white/5 p-4 rounded-xl"
              />

              <input
                placeholder="Technologies (Press Enter)"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleTagAdd}
                className="w-full bg-white/5 p-4 rounded-xl"
              />

              <div className="flex gap-2 flex-wrap">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-cyan-500/10 rounded-full text-xs"
                  >
                    {tag}
                    <X
                      size={12}
                      className="inline ml-2 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </span>
                ))}
              </div>

              <input
                placeholder="Live URL"
                value={formData.liveUrl}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, liveUrl: e.target.value }))
                }
                className="w-full bg-white/5 p-4 rounded-xl"
              />

              <input
                placeholder="GitHub URL"
                value={formData.codeUrl}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, codeUrl: e.target.value }))
                }
                className="w-full bg-white/5 p-4 rounded-xl"
              />

              <button
                disabled={loading}
                className={`w-full py-4 font-black rounded-xl ${
                  loading
                    ? "bg-gray-400 text-black cursor-not-allowed"
                    : "bg-white text-black hover:bg-cyan-400"
                }`}
              >
                {loading ? "UPLOADING..." : "PUBLISH PROJECT"}
              </button>
            </div>

            {/* PREVIEW */}
            <div className="lg:col-span-5">
              <div className="h-[420px] bg-black rounded-3xl p-6">
                {formData.imagePreview && (
                  <img
                    src={formData.imagePreview}
                    className="h-40 w-full object-cover rounded-xl mb-4"
                    alt="Preview"
                  />
                )}
                <h3 className="text-xl font-bold">
                  {formData.title || "Project Title"}
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  {formData.description || "Project description preview"}
                </p>
              </div>
            </div>
          </form>
        ) : (
          /* SUCCESS */
          <div className="text-center py-24">
            <CheckCircle2 size={64} className="text-cyan-400 mx-auto mb-6" />
            <h2 className="text-4xl font-black mb-4">
              PROJECT PUBLISHED
            </h2>
            <button
              onClick={()=>{ navigate('/') }}
              className="px-10 py-4 bg-white text-black rounded-full font-black"
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
