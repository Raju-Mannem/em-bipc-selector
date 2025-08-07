"use client";
import { useState } from "react";
import Cutoff2024 from "@/components/Cutoff2024";

const Dashboard = () => {
  return (
    <main className="h-full w-full px-2 py-2">
      <section className="flex  justify-end gap-4 items-center px-12 py-4 my-4 text-[8px] sm:text-sm font-sans bg-indigo-200">
        <article className="px-2 bg-stone-50 rounded-sm">
            Cutoff 2024
        </article>
      </section>
      {<Cutoff2024 />}
    </main>
  );
};

export default Dashboard;
