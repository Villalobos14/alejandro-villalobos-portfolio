'use client'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Works from '@/components/Works'
import React, { useEffect } from 'react'

export default function Page() {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Header />
      <Works />
      <Footer />
    </>
  )
}
