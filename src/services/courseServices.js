import API from "./api";

export const getCourses = (params = {}) => API.get("/courses", { params });

export const getCourseById = (id) => API.get(`/courses/${id}`);

export const getModules = (courseId) => API.get(`/modules/${courseId}`);

export const getLessons = (moduleId) =>
  API.get(`/lessons?moduleId=${moduleId}`);
