'use client'

import { useExtractionStore } from '@/store/extraction'
import { GridBackground } from '@/components/layout/GridBackground'
import { Navbar } from '@/components/layout/Navbar'
import { BlobBackground } from '@/components/layout/BlobBackground'
import { LandingSection } from '@/components/sections/LandingSection'
import { UploadSection } from '@/components/sections/UploadSection'
import { ProcessingSection } from '@/components/sections/ProcessingSection'
import { ResultsSection } from '@/components/sections/ResultsSection'
import { Toast } from '@/components/ui/Toast'

export default function Home() {
  const phase = useExtractionStore(s => s.phase)

  return (
    <main className="relative min-h-screen">
      <GridBackground />
      <BlobBackground />
      <Navbar />
      <Toast />

      {(phase === 'landing' || phase === 'upload') && (
        <>
          <LandingSection />
          <UploadSection />
        </>
      )}
      {phase === 'processing' && <ProcessingSection />}
      {phase === 'results' && <ResultsSection />}
    </main>
  )
}
