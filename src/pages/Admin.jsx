import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import api from "../api";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [tab, setTab] = useState("inquiries");
  const tabsList = [
    "inquiries",
    "applications",
    "products",
    "careers",
    "gallery",
    "stats",
    "clients",
    "technologies",
  ];
  const [dataList, setDataList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    unitType: "qty",
    requirements: "",
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Tracks the number of inquiries to detect when a new one arrives
  const prevInquiryCount = useRef(0);

  // --- POLLING & AUTOMATIC AUDIO NOTIFICATION ---
  useEffect(() => {
    if (!token) return;

    fetchData(); // Initial Fetch

    let interval;
    if (tab === "inquiries") {
      interval = setInterval(async () => {
        try {
          const res = await api.get("/inquiries");
          const currentCount = res.data.length;

          // If we have a new inquiry
          if (
            prevInquiryCount.current > 0 &&
            currentCount > prevInquiryCount.current
          ) {
            toast.success("🚨 New Inquiry Received!", {
              icon: "🔔",
              duration: 6000,
            });

            // Play WhatsApp-style MP3 Notification automatically
            const audio = new Audio("/notification.mp3");
            audio.play().catch((e) => {
              console.warn(
                "Browser blocked audio. You must click anywhere on the page at least once before audio can play.",
                e
              );
            });
          }

          prevInquiryCount.current = currentCount; // Update tracker
          setDataList(res.data); // Update UI
        } catch (err) {}
      }, 10000); // Checks every 10 seconds
    }

    return () => clearInterval(interval);
  }, [tab, token]); // Dependencies

  const fetchData = async () => {
    try {
      const res = await api.get(`/${tab}`);
      setDataList(res.data);
      if (tab === "inquiries") prevInquiryCount.current = res.data.length;
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/login", credentials);
      localStorage.setItem("adminToken", res.data.token);
      setToken(res.data.token);
      toast.success("Access Granted");
    } catch (err) {
      toast.error("Access Denied");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.keys(formData).forEach((key) => payload.append(key, formData[key]));
    if (file) payload.append("image", file);

    try {
      const isJsonForm = tab === "careers" || tab === "stats";
      if (editingId) {
        await api.put(`/${tab}/${editingId}`, isJsonForm ? formData : payload);
        toast.success("Updated Successfully!");
      } else {
        await api.post(`/${tab}`, isJsonForm ? formData : payload);
        toast.success("Added Successfully!");
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error("Error saving data");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      ...item,
      requirements: item.requirements ? item.requirements.join(", ") : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/${tab}/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch (err) {
      toast.error("Error deleting");
    }
  };

  const resetForm = () => {
    setFormData({ unitType: "qty", requirements: "" });
    setFile(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const generateAI = async () => {
    if (!aiPrompt) return toast.error("Enter a keyword for AI first.");
    setIsAiLoading(true);
    try {
      const res = await api.post("/ai/suggest", {
        promptText: aiPrompt,
        type: tab,
      });
      const text = res.data.result;
      const titleMatch = text.match(/Title:\s*(.*?)\s*\|/);
      const descMatch = text.match(/Desc:\s*(.*)/);
      if (titleMatch && descMatch) {
        setFormData((prev) => ({
          ...prev,
          name: titleMatch[1],
          title: titleMatch[1],
          description: descMatch[1],
          desc: descMatch[1],
        }));
        toast.success("AI Generated Successfully!");
      } else {
        toast.success(
          "AI Generated, but format was slightly off. Check console."
        );
        console.log("Raw AI Response:", text);
      }
    } catch (err) {
      toast.error("AI Generation Failed");
    }
    setIsAiLoading(false);
  };

  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pointer-events-auto">
        <form
          onSubmit={handleLogin}
          className="bg-black/80 p-8 rounded-2xl border border-red-500/30 shadow-[0_0_30px_rgba(255,0,0,0.2)]"
        >
          <h2 className="text-2xl font-bold text-red-500 mb-6 font-mono">
            ADMIN_AUTH_REQUIRED
          </h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 mb-4 bg-black/50 border border-white/20 text-white rounded"
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 bg-black/50 border border-white/20 text-white rounded"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded tracking-widest transition-colors"
          >
            AUTHORIZE
          </button>
        </form>
      </div>
    );

  return (
    <div className="min-h-screen pt-32 px-6 text-white max-w-6xl mx-auto pointer-events-auto pb-20">
      {/* HEADER - BUTTON REMOVED */}
      <div className="flex flex-wrap justify-between items-center mb-8 border-b border-white/10 pb-4 gap-4">
        <h1 className="text-4xl font-bold text-green-400 font-mono">
          SYSTEM_ADMIN
        </h1>
        <button
          onClick={handleLogout}
          className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white"
        >
          LOGOUT
        </button>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tabsList.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              resetForm();
            }}
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest ${
              tab === t
                ? "bg-orange-500 text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE: FORM */}
        {tab !== "inquiries" && tab !== "applications" && (
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-max sticky top-24">
            <h2 className="text-2xl mb-4 font-bold text-orange-400">
              {editingId ? "Edit" : "Add New"} {tab}
            </h2>

            {/* AI Generator Tool */}
            {(tab === "products" || tab === "careers") && (
              <div className="mb-6 bg-black/40 p-4 rounded border border-blue-500/30 flex gap-2">
                <input
                  type="text"
                  placeholder="E.g. Video Wall P2.5"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-transparent border-b border-blue-500/50 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={generateAI}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold whitespace-nowrap"
                >
                  {isAiLoading ? "Wait..." : "✨ AI Assist"}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === "stats" && (
                <>
                  <input
                    name="label"
                    placeholder="Label (e.g., Happy Clients)"
                    value={formData.label || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    required
                  />
                  <input
                    name="value"
                    type="number"
                    placeholder="Value (e.g., 50)"
                    value={formData.value || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    required
                  />
                  <input
                    name="suffix"
                    placeholder="Suffix (e.g., + or %)"
                    value={formData.suffix || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, suffix: e.target.value })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                  />
                </>
              )}

              {tab === "products" && (
                <>
                  <input
                    name="name"
                    placeholder="Product Name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    required
                  />
                  <div className="flex gap-4">
                    <input
                      name="category"
                      placeholder="Category"
                      value={formData.category || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="p-3 bg-black/50 border border-white/20 rounded text-white flex-1"
                      required
                    />
                    <select
                      name="unitType"
                      value={formData.unitType || "qty"}
                      onChange={(e) =>
                        setFormData({ ...formData, unitType: e.target.value })
                      }
                      className="p-3 bg-black/50 border border-white/20 rounded text-white w-40"
                    >
                      <option value="qty">By QTY</option>
                      <option value="sqft">By Sq.Ft</option>
                    </select>
                  </div>
                  <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    required
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white h-32"
                    required
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])}
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    accept="image/*"
                  />
                </>
              )}

              {tab === "careers" && (
                <>
                  <input
                    name="title"
                    placeholder="Job Title"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    required
                  />
                  <input
                    name="tag"
                    placeholder="Tag (e.g. HARDWARE)"
                    value={formData.tag || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, tag: e.target.value })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    required
                  />
                  <textarea
                    name="desc"
                    placeholder="Short Description"
                    value={formData.desc || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, desc: e.target.value })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    required
                  />
                  <textarea
                    name="requirements"
                    placeholder="Requirements (Comma separated)"
                    value={formData.requirements || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    required
                  />
                </>
              )}

              {(tab === "clients" ||
                tab === "technologies" ||
                tab === "gallery") && (
                <>
                  <input
                    name="name"
                    placeholder="Name/Title"
                    value={formData.name || formData.title || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        title: e.target.value,
                      })
                    }
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    required
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])}
                    className="p-3 bg-black/50 border border-white/20 rounded text-white"
                    accept="image/*"
                  />
                </>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 flex-1 hover:bg-green-400 text-black font-bold py-3 rounded mt-2"
                >
                  {editingId ? "UPDATE" : "SAVE"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded mt-2"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* RIGHT SIDE: DATA LIST */}
        <div
          className={`space-y-4 ${
            tab === "inquiries" || tab === "applications" ? "md:col-span-2" : ""
          }`}
        >
          {tab === "inquiries" && (
            <h2 className="text-2xl mb-4 font-bold text-orange-400">
              Customer Inquiries ({dataList.length})
            </h2>
          )}
          {tab === "applications" && (
            <h2 className="text-2xl mb-4 font-bold text-cyan-400">
              Job Applications ({dataList.length})
            </h2>
          )}

          {dataList.map((item) => (
            <div
              key={item._id}
              className="bg-black/50 p-4 rounded border border-white/10 flex flex-col md:flex-row justify-between gap-4"
            >
              {tab === "inquiries" && (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-green-400">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Requested: {item.amount} {item.unitType}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right text-sm font-mono text-gray-300 flex flex-col items-end justify-center">
                    <p>👤 {item.name}</p>
                    <p>✉️ {item.email || "N/A"}</p>
                    <p>📞 {item.phone}</p>
                    <a
                      href={`tel:${item.phone}`}
                      className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105"
                    >
                      📞 CALL NOW
                    </a>
                  </div>
                </>
              )}

              {tab === "applications" ? (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400">
                      Role: {item.jobTitle}
                    </h3>
                    <p className="text-lg font-bold text-white mt-1">
                      Applicant: {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Applied: {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right text-sm font-mono text-gray-300 flex flex-col items-end justify-center gap-1">
                    <p>✉️ {item.email}</p>
                    <p>📞 {item.phone}</p>
                    <div className="flex gap-2 mt-2">
                      {/* VIEW RESUME BUTTON */}
                      <a 
  href={item.resumeUrl} 
  target="_blank" 
  rel="noopener noreferrer" 
  className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105"
>
  📄 OPEN RESUME
</a>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1 rounded-full"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                tab !== "inquiries" && (
                  <>
                    <div className="flex gap-4 items-center">
                      {(item.image || item.img) && (
                        <img
                          src={item.image || item.img}
                          alt="img"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-lg">
                          {item.name || item.title}
                        </h3>
                        {item.price && (
                          <p className="text-green-400 text-sm">
                            ₹{item.price}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )
              )}
            </div>
          ))}
          {dataList.length === 0 && (
            <p className="text-gray-500 italic text-center py-10">
              No data found in {tab}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
