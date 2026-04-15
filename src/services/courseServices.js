import API from "./api";

export const getCourses = async (params = {}) => {
  const res = await API.get("/courses", { params });
  return res.data;
};
