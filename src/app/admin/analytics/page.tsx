"use client";

import Topbar from "@/components/admin/Topbar";
import { TOP_QUESTIONS, STRUGGLE_TOPICS } from "@/data/admin-mock";
import { TrendingUp, AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

export default function AiInsightsPage() {
  return (
    <>
      <Topbar title="AI Insights" description="See how students are using ReadAM's AI, predictions, and alerts." />

      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top questions */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Top questions students ask AI</h3>
              <button className="text-xs font-semibold text-blue-600 hover:underline">View all</button>
            </div>

            <div className="mt-5 space-y-4">
              {TOP_QUESTIONS.map((q) => (
                <div key={q.id} className="flex items-start justify-between gap-3 rounded-xl bg-gray-50/70 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">&ldquo;{q.text}&rdquo;</p>
                    <p className="mt-1 text-xs text-gray-400">{q.subject}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                    {q.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Where students struggle */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Where students struggle most</h3>
            <p className="text-xs text-gray-400">Based on repeated AI question patterns</p>

            <div className="mt-5 space-y-4">
              {STRUGGLE_TOPICS.map((t) => (
                <div key={t.id}>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-700">{t.topic}</span>
                    <span className="text-gray-400">{t.percent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-orange-400 transition-all"
                      style={{ width: `${t.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* At-risk predictions */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">At-risk student predictions</h3>
              <button className="text-xs font-semibold text-blue-600 hover:underline">View all</button>
            </div>
            <p className="text-xs text-gray-400">Students likely to fall behind, based on AI usage</p>

            <div className="mt-5 space-y-3">
              {["Amara Mbeya", "Kofi Danso", "Fabou Sankang"].map((name) => (
                <div key={name} className="flex items-center justify-between rounded-xl bg-red-50/60 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    {name}
                  </span>
                  <span className="text-xs font-semibold text-red-600">High risk</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rising subject demand */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Rising subject demand</h3>
            <p className="text-xs text-gray-400">What students are searching for, via subject</p>

            <div className="mt-5 space-y-3">
              {[
                { subject: "Web Development", growth: "+148%" },
                { subject: "Personal Finance", growth: "+92%" },
                { subject: "Data Analysis", growth: "+61%" },
              ].map((item) => (
                <div key={item.subject} className="flex items-center justify-between rounded-xl bg-emerald-50/60 px-3 py-2.5">
                  <span className="text-sm font-medium text-gray-800">{item.subject}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {item.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform maintenance */}
        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
          <h3 className="text-sm font-bold text-red-700">Platform Maintenance</h3>
          <p className="mt-1 text-xs text-red-600/80">
            Perform critical actions like database resets, cache clearing, or service termination.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" />
              Clear Cache
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700">
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
