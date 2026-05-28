import { useState, useRef } from 'react'
import { removeBackground } from '@imgly/background-removal'
import { removeColorBackground } from './utils/removeColorBg'
import { UploadZone } from './components/UploadZone'
import { ShapePicker } from './components/ShapePicker'
import { Controls } from './components/Controls'
import { CanvasPreview } from './components/CanvasPreview'
import { useImageCrop } from './hooks/useImageCrop'
import type { Shape } from './hooks/useImageCrop'

const SHAPE_LABELS: Record<Shape, string> = {
  circle: 'okrag',
  square: 'kwadrat',
  rounded: 'zaokraglony',
  heart: 'serce',
  star: 'gwiazda',
  hexagon: 'szesciokat',
}

export default function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  // Zapamiętuje obraz sprzed zastosowania progu koloru — do ponownego przetwarzania
  const [preThresholdImage, setPreThresholdImage] = useState<HTMLImageElement | null>(null)

  const [shape, setShape] = useState<Shape>('circle')
  const [size, setSize] = useState(300)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [transparent, setTransparent] = useState(false)

  const [isRemoving, setIsRemoving] = useState(false)
  const [bgRemoved, setBgRemoved] = useState(false)

  const [colorThreshold, setColorThreshold] = useState(80)
  const [colorApplied, setColorApplied] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewRef = useRef<HTMLCanvasElement>(null)

  useImageCrop({ image, shape, size, bgColor, transparent, canvasRef, previewRef })

  function handleImage(img: HTMLImageElement, file: File) {
    setImage(img)
    setImageFile(file)
    setBgRemoved(false)
    setColorApplied(false)
    setPreThresholdImage(null)
  }

  // ── AI background removal ──────────────────────────────────────────────────
  async function handleRemoveBg() {
    if (!imageFile) return
    setIsRemoving(true)
    try {
      const resultBlob = await removeBackground(imageFile, {
        output: { format: 'image/png', quality: 1 },
      })
      const url = URL.createObjectURL(resultBlob)
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(url)
        setImage(img)
        setPreThresholdImage(null) // reset bazy progu przy nowym AI-przetworzeniu
        setColorApplied(false)
        setTransparent(true)
        setBgRemoved(true)
        setIsRemoving(false)
      }
      img.src = url
    } catch (err) {
      console.error('Błąd usuwania tła:', err)
      setIsRemoving(false)
    }
  }

  // ── Color threshold removal ────────────────────────────────────────────────
  async function handleRemoveColorBg() {
    // Zawsze przetwarzaj od bazowego obrazu (przed poprzednim progiem),
    // żeby ponowne kliknięcie z inną wartością nie degradowało obrazu
    const base = preThresholdImage ?? image
    if (!base) return

    if (!preThresholdImage) {
      // Pierwsze zastosowanie — zapisz bieżący obraz jako bazę
      setPreThresholdImage(image)
    }

    const result = await removeColorBackground(base, colorThreshold)
    setImage(result)
    setTransparent(true)
    setColorApplied(true)
  }

  // ── Download ───────────────────────────────────────────────────────────────
  function handleDownload() {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `kadrowane_${SHAPE_LABELS[shape]}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  function handleReset() {
    setImage(null)
    setImageFile(null)
    setPreThresholdImage(null)
    setShape('circle')
    setSize(300)
    setBgColor('#ffffff')
    setTransparent(false)
    setIsRemoving(false)
    setBgRemoved(false)
    setColorThreshold(80)
    setColorApplied(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Edytor kadrowania obrazów
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Wytnij zdjęcie w dowolny kształt i pobierz jako PNG
          </p>
        </div>

        {!image ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <UploadZone onImage={handleImage} />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Preview + controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-6">
              {/* Preview */}
              <div className="flex-shrink-0 flex justify-center relative">
                <CanvasPreview previewRef={previewRef} transparent={transparent} />
                {isRemoving && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center
                    bg-white/80 rounded-xl backdrop-blur-sm gap-2">
                    <svg className="w-8 h-8 text-violet-500 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-xs text-violet-600 font-medium">Usuwam tło…</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex-1 flex flex-col gap-5 overflow-y-auto max-h-[600px] pr-1">
                <ShapePicker value={shape} onChange={setShape} />
                <Controls
                  size={size}
                  onSize={setSize}
                  bgColor={bgColor}
                  onBgColor={setBgColor}
                  transparent={transparent}
                  onTransparent={setTransparent}
                  onRemoveBg={handleRemoveBg}
                  isRemoving={isRemoving}
                  bgRemoved={bgRemoved}
                  colorThreshold={colorThreshold}
                  onColorThreshold={setColorThreshold}
                  onRemoveColorBg={handleRemoveColorBg}
                  colorApplied={colorApplied}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={isRemoving}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600
                  text-white font-semibold py-3 px-5 rounded-xl
                  hover:bg-indigo-700 active:scale-95 transition-all shadow-sm
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Pobierz PNG
              </button>
              <button
                onClick={handleReset}
                disabled={isRemoving}
                className="flex items-center justify-center gap-2 bg-white border border-gray-200
                  text-gray-600 font-medium py-3 px-5 rounded-xl
                  hover:bg-gray-50 active:scale-95 transition-all shadow-sm
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Nowe zdjęcie
              </button>
            </div>
          </div>
        )}

        {/* Hidden full-size output canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
