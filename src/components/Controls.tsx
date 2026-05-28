interface Props {
  size: number
  onSize: (v: number) => void
  bgColor: string
  onBgColor: (v: string) => void
  transparent: boolean
  onTransparent: (v: boolean) => void
  // AI bg removal
  onRemoveBg: () => void
  isRemoving: boolean
  bgRemoved: boolean
  // Color threshold removal
  colorThreshold: number
  onColorThreshold: (v: number) => void
  onRemoveColorBg: () => void
  colorApplied: boolean
}

export function Controls({
  size, onSize,
  bgColor, onBgColor,
  transparent, onTransparent,
  onRemoveBg, isRemoving, bgRemoved,
  colorThreshold, onColorThreshold, onRemoveColorBg, colorApplied,
}: Props) {
  return (
    <div className="flex flex-col gap-4">

      {/* ── AI Background removal ── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Usuń tło ze zdjęcia (AI)
        </label>
        <button
          onClick={onRemoveBg}
          disabled={isRemoving}
          className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
            border-2 font-medium text-sm transition-all
            ${bgRemoved
              ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
              : 'border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 hover:border-violet-400'
            }
            ${isRemoving ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}
          `}
        >
          {isRemoving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Przetwarzam… (AI)
            </>
          ) : bgRemoved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Tło usunięte — kliknij ponownie
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Usuń tło (AI, lokalnie)
            </>
          )}
        </button>
        {isRemoving && (
          <p className="text-xs text-violet-400 text-center">
            Pierwsze uruchomienie pobiera model (~40 MB). Kolejne są szybsze.
          </p>
        )}
      </div>

      {/* ── Color threshold removal ── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Wytnij logo z ciemnego tła
        </label>
        <p className="text-xs text-gray-400 leading-relaxed">
          Usuwa czarne/ciemne tło i zostawia samo logo — działa najlepiej gdy logo jest jasne na ciemnym tle.
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Siła działania</span>
            <span className="font-medium text-indigo-500">
              {colorThreshold < 60 ? 'delikatna' : colorThreshold < 130 ? 'średnia' : 'mocna'}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={240}
            step={5}
            value={colorThreshold}
            onChange={(e) => onColorThreshold(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-300">
            <span>← delikatnie</span>
            <span>mocno →</span>
          </div>
        </div>
        <button
          onClick={onRemoveColorBg}
          disabled={isRemoving}
          className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
            border-2 font-medium text-sm transition-all active:scale-95
            ${colorApplied
              ? 'border-sky-400 bg-sky-50 text-sky-700 hover:bg-sky-100'
              : 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:border-sky-400'
            }
            ${isRemoving ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          {colorApplied ? 'Zastosuj ponownie' : 'Wytnij ciemne tło'}
        </button>
      </div>

      {/* ── Size ── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Rozmiar wyjściowy: <span className="text-indigo-600">{size}px</span>
        </label>
        <input
          type="range"
          min={100}
          max={600}
          step={10}
          value={size}
          onChange={(e) => onSize(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-300">
          <span>100px</span>
          <span>600px</span>
        </div>
      </div>

      {/* ── Output background ── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Tło wyjściowe
        </label>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={transparent}
              onChange={(e) => onTransparent(e.target.checked)}
              className="w-4 h-4 accent-indigo-500"
            />
            Przezroczyste
          </label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onBgColor(e.target.value)}
            disabled={transparent}
            className={`w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5
              ${transparent ? 'opacity-30 cursor-not-allowed' : ''}`}
          />
          <span className={`text-sm font-mono text-gray-500 ${transparent ? 'opacity-30' : ''}`}>
            {bgColor}
          </span>
        </div>
      </div>
    </div>
  )
}
