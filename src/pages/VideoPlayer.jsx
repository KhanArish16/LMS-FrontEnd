import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { getAllVideos } from "../services/videoServices";
import { Loader } from "../components/Loader";
import {
  ArrowLeft,
  PlayCircle,
  BookOpen,
  User,
  Layers,
  Clock,
} from "lucide-react";

const getEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/"))
    return (
      "https://www.youtube.com/embed/" + url.split("youtu.be/")[1].split("?")[0]
    );
  return url;
};

const getYoutubeId = (url) => {
  if (!url) return "";
  if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0];
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
  if (url.includes("embed/")) return url.split("embed/")[1].split("?")[0];
  return "";
};

const getYoutubeThumbnail = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

const getThumbnail = (video) => {
  if (!video) return null;
  if (video.type === "YOUTUBE") return getYoutubeThumbnail(video.contentUrl);
  if (video.contentUrl?.includes("cloudinary"))
    return video.contentUrl.replace(".mp4", ".jpg");
  return null;
};

const CAT_STYLE = {
  DSA: "bg-blue-50   text-blue-700   border-blue-200",
  FRONTEND: "bg-violet-50 text-violet-700 border-violet-200",
  BACKEND: "bg-orange-50 text-orange-700 border-orange-200",
  FULLSTACK: "bg-indigo-50 text-indigo-700 border-indigo-200",
  MOBILE: "bg-pink-50   text-pink-700   border-pink-200",
  DATA_SCIENCE: "bg-teal-50   text-teal-700   border-teal-200",
  AI_ML: "bg-purple-50 text-purple-700 border-purple-200",
  CYBER_SECURITY: "bg-red-50    text-red-700    border-red-200",
  DEVOPS: "bg-cyan-50   text-cyan-700   border-cyan-200",
  CLOUD_COMPUTING: "bg-sky-50    text-sky-700    border-sky-200",
  UI_UX: "bg-rose-50   text-rose-700   border-rose-200",
  OTHER: "bg-gray-100  text-gray-600   border-gray-200",
};

function catCls(cat) {
  return CAT_STYLE[cat] ?? CAT_STYLE.OTHER;
}

function SuggestionCard({ video, onClick }) {
  const thumb = getThumbnail(video);
  return (
    <div
      onClick={onClick}
      className="group flex gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-all"
    >
      <div
        className="relative shrink-0 rounded-xl overflow-hidden bg-gray-100"
        style={{ width: 100, height: 58 }}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlayCircle size={20} className="text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <PlayCircle size={16} className="text-white" />
        </div>
        {video.type === "YOUTUBE" && (
          <div className="absolute top-1 left-1 bg-red-600 rounded px-1">
            <PlayCircle size={8} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
          {video.title}
        </p>
        <p className="text-[10px] text-gray-400 mt-1 truncate">
          {video.module?.title ?? "Module"}
        </p>
        <span
          className={`inline-block mt-1 px-1.5 py-0.5 text-[9px] font-black tracking-widest border ${catCls(video.category)}`}
          style={{ borderRadius: "3px" }}
        >
          {(video.category ?? "OTHER").replace(/_/g, " ")}
        </span>
      </div>
    </div>
  );
}

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideo();
    fetchSuggestions();
  }, [id]);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/lessons/${id}`);
      setVideo(res.data?.data ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await getAllVideos();
      const all = res.data?.data || [];
      const vids = all.filter(
        (l) => (l.type === "VIDEO" || l.type === "YOUTUBE") && l._id !== id,
      );
      setSuggestions(vids.slice(0, 10));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );

  if (!video)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <PlayCircle size={28} className="text-gray-300" />
        <p className="text-sm text-gray-400">Video not found.</p>
        <button
          onClick={() => navigate("/videos")}
          className="text-xs text-blue-600 font-bold hover:underline"
        >
          ← Back
        </button>
      </div>
    );

  const isYT = video.type === "YOUTUBE";
  const initials = video.instructor?.name?.slice(0, 2).toUpperCase() ?? "IN";

  return (
    <div className="w-full max-w-6xl mx-auto pb-16">
      <div className="flex items-center gap-3 py-4 mb-2">
        <button
          onClick={() => navigate("/videos")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-600 transition-colors shrink-0"
        >
          <ArrowLeft size={13} /> Back
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-4">
          <div
            className="rounded-2xl overflow-hidden bg-black border border-gray-100"
            style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
          >
            {isYT ? (
              <iframe
                src={getEmbedUrl(video.contentUrl)}
                title={video.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            ) : (
              <video
                src={video.contentUrl}
                controls
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-2 flex-wrap">
              {video.category && (
                <span
                  className={`inline-block px-2 py-0.5 text-[10px] font-black tracking-widest border shrink-0 ${catCls(video.category)}`}
                  style={{ borderRadius: "4px" }}
                >
                  {video.category.replace(/_/g, " ")}
                </span>
              )}
              {isYT && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 rounded-md text-[10px] font-bold text-red-600 shrink-0">
                  <PlayCircle size={10} /> YouTube
                </span>
              )}
            </div>

            <h1
              className="font-bold text-gray-900 leading-snug"
              style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)" }}
            >
              {video.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t border-gray-100">
              {video.module?.title && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Layers size={12} className="text-gray-400" />{" "}
                  {video.module.title}
                </span>
              )}
            </div>

            {(video.instructor || video.author) && (
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                {video.instructor?.profilePic || video.author?.profilePic ? (
                  <img
                    src={
                      video.instructor?.profilePic || video.author?.profilePic
                    }
                    alt="Uploader"
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-white">
                      {initials}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Uploaded by</p>
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {video.instructor?.name ||
                      video.author?.name ||
                      "Instructor"}
                  </p>
                  {(video.instructor?.role || video.author?.role) && (
                    <p className="text-[11px] text-gray-400 truncate">
                      {video.instructor?.role || video.author?.role}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-3">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <PlayCircle size={14} className="text-blue-500" />
              <h2 className="text-sm font-bold text-gray-900">More Videos</h2>
              <span className="ml-auto text-[10px] text-gray-400 font-medium">
                {suggestions.length}
              </span>
            </div>

            {suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <PlayCircle size={22} className="text-gray-200" />
                <p className="text-xs text-gray-400">No suggestions</p>
              </div>
            ) : (
              <div
                className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {suggestions.map((v) => (
                  <SuggestionCard
                    key={v._id}
                    video={v}
                    onClick={() => navigate(`/videos/${v._id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
