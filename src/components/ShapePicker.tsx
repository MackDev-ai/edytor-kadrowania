import type { Shape } from '../hooks/useImageCrop'

interface Props {
  value: Shape
  onChange: (s: Shape) => void
}

const SHAPES: { id: Shape; label: string; icon: string }[] = [
  { id: 'circle', label: 'Okrąg', icon: '⬤' },
  { id: 'square', label: 'Kwadrat', icon: '■' },
  { id: 'rounded', label: 'Zaokrąglony', icon: '▢' },
  { id: 'heart', label: 'Serce', icon: '♥' },
  { id: 'star', label: 'Gwiazda', icon: '★' },
  { id: 'hexagon', label: 'Sześciokąt', icon: '⬡' },
]

export function ShapePicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Kształt
      </label>
      <div className="grid grid-cols-3 gap-2">
        {SHAPES.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl
              border-2 text-sm font-medium transition-all
              ${
                value === id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
