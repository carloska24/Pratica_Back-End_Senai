"use client";

import CampusApp from "@/features/shell/CampusApp";
import { StudentAccess } from "@/features/auth/StudentAccess";

export default function Home() {
  return <StudentAccess><CampusApp /></StudentAccess>;
}
