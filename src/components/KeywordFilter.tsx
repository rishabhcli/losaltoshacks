"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

interface KeywordFilterProps {
  keywords: string[];
  activeKeywords: string[];
  onToggle: (keyword: string) => void;
  onAdd: (keyword: string) => void;
}

export default function KeywordFilter({
  keywords,
  activeKeywords,
  onToggle,
  onAdd,
}: KeywordFilterProps) {
  const [showInput, setShowInput] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  function handleAdd() {
    if (newKeyword.trim()) {
      onAdd(newKeyword.trim().toLowerCase());
      setNewKeyword("");
      setShowInput(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        Filters
      </span>
      {keywords.map((kw) => (
        <motion.button
          key={kw}
          layout
          onClick={() => onToggle(kw)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            activeKeywords.includes(kw)
              ? "bg-indigo-500 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          {kw}
          {activeKeywords.includes(kw) && <X className="h-3 w-3" />}
        </motion.button>
      ))}

      <AnimatePresence>
        {showInput ? (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-1"
          >
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add keyword..."
              className="h-7 w-32 rounded-full border border-gray-700 bg-gray-800 px-3 text-xs text-gray-100 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <button
              onClick={() => setShowInput(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            layout
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1 rounded-full border border-dashed border-gray-600 px-3 py-1.5 text-xs text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
