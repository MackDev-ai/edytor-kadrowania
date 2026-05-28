import { useRef } from 'react'
import type { DragEvent, ChangeEvent } from 'react'

interface Props {
  onImage: (img: HTMLImageElement, file: File) => void
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

export function UploadZone({ onImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function loadFile(file: File) {
    if (!ACCEPTED.includes(file.type)) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      onImage(img, file)
    }
    img.src = url
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) loadFile(file)
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={() => inputRef.current?.click()}
      className="flex flex-col items-center justify-center gap-3 w-full max-w-sm mx-auto
        border-2 border-dashed border-gray-300 rounded-2xl p-10 cursor-pointer
        text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors
        select-none"
    >
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
      <p className="text-center text-sm leading-relaxed">
        Przeciągnij zdjęcie tutaj<br />
        <span className="text-xs text-gray-300">lub kliknij, aby wybrać plik</span>
      </p>
      <p className="text-xs text-gray-300">JPG, PNG, WEBP</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onChange}
      />
    </div>
  )
}
