"use client"

import { useState } from "react"
import { X } from "lucide-react"

export function TopBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="relative flex items-center justify-center bg-[#4abe8c] py-2 text-[#fff]">
      <p className="text-sm font-medium">
        {"All products on this page are free to try! | "}
        <span className="underline cursor-pointer">{"Free shipping on your first order"}</span>
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#fff] hover:text-[#e0e0e0] transition-colors"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
