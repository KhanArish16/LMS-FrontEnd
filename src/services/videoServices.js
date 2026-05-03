import API from "./api";

export const getAllVideos = () => API.get("/lessons");
