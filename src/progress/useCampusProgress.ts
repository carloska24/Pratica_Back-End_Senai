"use client";

import { useEffect, useState } from "react";
import { courseLibrary } from "@/course/courseLibrary";
import {
  readArrayLength,
  readMasteredModules,
  readSequentialIntegers,
  readUniqueIntegers,
  readUniqueStrings,
} from "@/progress/storage";

const courseItemIds = new Set(
  courseLibrary.flatMap(module => module.items.map(item => item.id)),
);

export function useCampusProgress() {
  const [progress, setProgress] = useState({
    reviews: 0,
    examples: 0,
    challenges: 0,
    attempts: 0,
    m07Mastered: false,
    m08Mastered: false,
    m09Mastered: false,
    m10Mastered: false,
    m11Mastered: false,
    m12Mastered: false,
  });

  useEffect(() => {
    const refresh = () => {
      const mastered = readMasteredModules();
      setProgress({
        reviews: readUniqueStrings("campus-course-library", courseItemIds).length,
        examples: readUniqueIntegers("campus-function-examples", 1, 20).length,
        challenges: readSequentialIntegers("campus-practice-challenges", 6).length,
        attempts: readArrayLength("campus-lab-attempts"),
        m07Mastered: mastered.includes("M07"),
        m08Mastered: mastered.includes("M08"),
        m09Mastered: mastered.includes("M09"),
        m10Mastered: mastered.includes("M10"),
        m11Mastered: mastered.includes("M11"),
        m12Mastered: mastered.includes("M12"),
      });
    };

    refresh();
    window.addEventListener("campus-progress-changed", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("campus-progress-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return progress;
}

export type CampusProgress = ReturnType<typeof useCampusProgress>;
