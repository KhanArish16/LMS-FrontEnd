import API from "./api";

export const getBlogs = (params = {}) => API.get("/blogs", { params });

export const getBlogById = (id) => API.get(`/blogs/${id}`);

export const createBlog = (data) => API.post("/blogs/create", data);

export const updateBlog = (id, data) => API.put(`/blogs/${id}/update`, data);

export const deleteBlog = (id) => API.delete(`/blogs/${id}/delete`);
