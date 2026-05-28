import type { RefObject } from 'react'

interface Props {
  previewRef: RefObject<HTMLCanvasElement | null>
  transparent: boolean
}

export function CanvasPreview({ previewRef, transparent }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide self-start">
        Podgląd
      </label>
      {/* Kontener o sztywnych wymiarach 300×300 — eliminuje skoki layoutu */}
      <div
        className="rounded-xl overflow-hidden border border-gray-200 shadow-sm w-[300px] h-[300px] flex-shrink-0"
        style={{
          background: transparent
            ? 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 0 0 / 16px 16px'
            : 'transparent',
        }}
      >
        <canvas
          ref={previewRef}
          className="block w-[300px] h-[300px]"
        />
      </div>
    </div>
  )
}
