import { useEffect, useState } from "react";
import { getAllVideos } from "../services/videoServices";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Loader";
import SearchFilter from "../components/SearchFilter";
import useDebounce from "../hooks/useDebounce";
import { PlayCircle, Clock, BookOpen } from "lucide-react";

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

const formatDuration = (sec) => {
  if (!sec) return null;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const getThumbnail = (video) => {
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

export default function Videos() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("");
  const [durations, setDurations] = useState({});
  const [progress, setProgress] = useState({});

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    let data = [...videos];
    if (debouncedSearch)
      data = data.filter((v) =>
        v.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    if (category) data = data.filter((v) => v.category === category);
    if (sort === "latest")
      data = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    if (sort === "oldest")
      data = [...data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    setFiltered(data);
  }, [debouncedSearch, category, sort, videos]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await getAllVideos();
      const lessons = res.data?.data || [];
      const vids = lessons.filter(
        (l) => l.type === "VIDEO" || l.type === "YOUTUBE",
      );
      setVideos(vids);
      setFiltered(vids);
      extractDurations(vids);
      const saved = JSON.parse(localStorage.getItem("videoProgress") || "{}");
      setProgress(saved);
    } catch (err) {
      console.error("Video fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const extractDurations = async (list) => {
    const temp = {};
    for (const v of list) {
      if (v.type === "VIDEO") {
        await new Promise((resolve) => {
          const el = document.createElement("video");
          el.src = v.contentUrl;
          el.onloadedmetadata = () => {
            temp[v._id] = el.duration;
            resolve();
          };
          el.onerror = resolve;
          setTimeout(resolve, 3000);
        });
      }
    }
    setDurations(temp);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Videos</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {filtered.length} video{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <SearchFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          level={level}
          setLevel={setLevel}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <div
        className="flex-1 overflow-y-auto pt-4 pb-6"
        style={{ scrollbarWidth: "none" }}
      >
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-gray-100 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <PlayCircle size={26} className="text-blue-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              No videos found
            </p>
            <p className="text-xs text-gray-400">
              {search || category
                ? "Try adjusting your filters"
                : "Check back later"}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((video) => {
              const thumb = getThumbnail(video);
              const duration = durations[video._id];
              const watched = progress[video._id] || 0;
              const pct =
                duration && watched > 0
                  ? Math.min((watched / duration) * 100, 100)
                  : 0;
              const isYT = video.type === "YOUTUBE";

              return (
                <div
                  key={video._id}
                  onClick={() => navigate(`/videos/${video._id}`)}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div
                    className="relative overflow-hidden bg-gray-100"
                    style={{ aspectRatio: "16/9" }}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                        <h2 className="text-lg font-bold text-gray-500 text-center px-3">
                          {video.title}
                        </h2>
                        <PlayCircle size={36} className="text-gray-300" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <PlayCircle
                          size={22}
                          className="text-gray-800 ml-0.5"
                        />
                      </div>
                    </div>

                    {isYT && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-red-600 rounded-md">
                        <PlayCircle size={10} className="text-white" />
                        <span className="text-[9px] font-bold text-white">
                          YouTube
                        </span>
                      </div>
                    )}

                    {duration && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        {formatDuration(duration)}
                      </span>
                    )}

                    {pct > 0 && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-black/20">
                        <div
                          className="h-full bg-red-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 mb-2 text-[10px] font-black tracking-widest border ${catCls(video.category)}`}
                      style={{ borderRadius: "4px" }}
                    >
                      {(video.category ?? "OTHER").replace(/_/g, " ")}
                    </span>

                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                      {video.title}
                    </h3>

                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 truncate min-w-0">
                        <BookOpen
                          size={11}
                          className="text-gray-300 shrink-0"
                        />
                        <span className="truncate">
                          {video.module?.title ?? "Module"}
                        </span>
                      </div>
                      {pct > 0 && (
                        <span className="text-[10px] font-bold text-red-500 shrink-0 ml-2">
                          {Math.round(pct)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
