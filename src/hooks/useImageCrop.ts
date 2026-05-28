import { useEffect } from 'react'
import type { RefObject } from 'react'

export type Shape = 'circle' | 'square' | 'rounded' | 'heart' | 'star' | 'hexagon'

interface CropOptions {
  image: HTMLImageElement | null
  shape: Shape
  size: number
  bgColor: string
  transparent: boolean
  canvasRef: RefObject<HTMLCanvasElement | null>
  previewRef: RefObject<HTMLCanvasElement | null>
}

function drawShape(ctx: CanvasRenderingContext2D, size: number, shape: Shape) {
  const s = size
  const half = s / 2
  const r = half

  ctx.beginPath()

  switch (shape) {
    case 'circle':
      ctx.arc(half, half, r, 0, Math.PI * 2)
      break

    case 'square':
      ctx.rect(0, 0, s, s)
      break

    case 'rounded': {
      const radius = s * 0.15
      ctx.moveTo(radius, 0)
      ctx.lineTo(s - radius, 0)
      ctx.quadraticCurveTo(s, 0, s, radius)
      ctx.lineTo(s, s - radius)
      ctx.quadraticCurveTo(s, s, s - radius, s)
      ctx.lineTo(radius, s)
      ctx.quadraticCurveTo(0, s, 0, s - radius)
      ctx.lineTo(0, radius)
      ctx.quadraticCurveTo(0, 0, radius, 0)
      ctx.closePath()
      break
    }

    case 'heart': {
      const x = half
      const y = half
      const w = s * 0.45
      const h = s * 0.4
      const yOff = s * 0.1

      ctx.moveTo(x, y + h * 0.6)
      ctx.bezierCurveTo(x - w * 1.5, y - h * 0.1, x - w * 1.5, y - h * 1.1, x, y - yOff)
      ctx.bezierCurveTo(x + w * 1.5, y - h * 1.1, x + w * 1.5, y - h * 0.1, x, y + h * 0.6)
      ctx.closePath()
      break
    }

    case 'star': {
      const cx = half
      const cy = half
      const outerR = r * 0.9
      const innerR = r * 0.38
      const points = 5
      const startAngle = -Math.PI / 2

      for (let i = 0; i < points * 2; i++) {
        const angle = startAngle + (i * Math.PI) / points
        const rad = i % 2 === 0 ? outerR : innerR
        const px = cx + rad * Math.cos(angle)
        const py = cy + rad * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      break
    }

    case 'hexagon': {
      const cx = half
      const cy = half
      const hexR = r * 0.92

      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i - 30)
        const px = cx + hexR * Math.cos(angle)
        const py = cy + hexR * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      break
    }
  }
}

function renderToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  shape: Shape,
  size: number,
  bgColor: string,
  transparent: boolean,
) {
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, size, size)

  if (!transparent) {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)
  }

  ctx.save()
  drawShape(ctx, size, shape)
  ctx.clip()

  const srcSize = Math.min(image.naturalWidth, image.naturalHeight)
  const sx = (image.naturalWidth - srcSize) / 2
  const sy = (image.naturalHeight - srcSize) / 2

  ctx.drawImage(image, sx, sy, srcSize, srcSize, 0, 0, size, size)
  ctx.restore()
}

export function useImageCrop({
  image,
  shape,
  size,
  bgColor,
  transparent,
  canvasRef,
  previewRef,
}: CropOptions) {
  useEffect(() => {
    if (!image || !canvasRef.current || !previewRef.current) return

    // Full-size output canvas (rozmiar do pobrania)
    renderToCanvas(canvasRef.current, image, shape, size, bgColor, transparent)

    // Podgląd — zawsze stałe 300px, niezależnie od suwaka rozmiaru
    renderToCanvas(previewRef.current, image, shape, 300, bgColor, transparent)
  }, [image, shape, size, bgColor, transparent, canvasRef, previewRef])
}
