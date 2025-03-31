import { useState, useRef } from 'react'
import { useScroll } from 'framer-motion'

export function useDataManagement(initialData) {
  const [activeSection, setActiveSection] = useState('home')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(initialData)
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({
    container: scrollRef,
  })

  return {
    activeSection,
    setActiveSection,
    loading,
    setLoading,
    error,
    setError,
    data,
    setData,
    scrollRef,
    scrollYProgress,
  }
}