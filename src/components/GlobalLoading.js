"use client"

import { useLoading } from "@/contexts/LoadingContext"
import { useEffect, useState } from "react"

export default function GlobalLoading() {
  const { isLoading } = useLoading()
  const [loadingText, setLoadingText] = useState("Loading")

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingText((prev) => (prev.length < 10 ? prev + "." : "Loading"))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50 overflow-hidden">
      <div className="relative w-full h-full">
        {/* Animated circuit background */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#1a202c" />
          <path
            d="M0 80 L200 80 L200 100 L100 100 L100 120 L300 120 L300 100 L400 100"
            stroke="#4fd1c5"
            strokeWidth="0.5"
            fill="none"
            className="circuit-line"
          />
          <path
            d="M0 140 L100 140 L100 160 L200 160 L200 180 L300 180 L300 160 L400 160"
            stroke="#4fd1c5"
            strokeWidth="0.5"
            fill="none"
            className="circuit-line"
          />
          <path
            d="M0 220 L300 220 L300 240 L200 240 L200 260 L400 260"
            stroke="#4fd1c5"
            strokeWidth="0.5"
            fill="none"
            className="circuit-line"
          />
        </svg>

        {/* Central loading element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32 bg-gray-800 rounded-lg border-2 border-teal-500 flex items-center justify-center">
            <div className="absolute inset-2 bg-gray-900 rounded-md"></div>
            <div className="absolute inset-4 bg-teal-500 rounded-md opacity-75 animate-pulse"></div>
            <div className="absolute inset-6 bg-gray-900 rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-teal-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <p className="text-teal-500 text-xl font-mono">{loadingText}</p>
        </div>
      </div>
    </div>
  )
}

