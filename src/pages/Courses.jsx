import React, { useState } from "react";
import CourseCard from "../components/CourseCard";
import { getCourses } from "../services/courseServices";

function Courses() {
  const [Courses, setCourses] = useState([]);
  return <div>Courses</div>;
}

export default Courses;
