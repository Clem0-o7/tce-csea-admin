"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/admin") // Redirect to /admin
  }, [router])

  return null // Render nothing as the user is being redirected
}
