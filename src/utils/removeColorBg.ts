/**
 * Usuwa piksele ciemniejsze niż podany próg jasności.
 * Działa na poziomie pikseli (ImageData) — bez bibliotek.
 * Użycie: białe logo na czarnym tle → threshold ~80 zostawia białe elementy.
 */
export function removeColorBackground(
  image: HTMLImageElement,
  threshold: number, // 0–255: piksele ciemniejsze niż to stają się przezroczyste
): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(image, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      // Luminancja percepcyjna (ludzkie oko lepiej widzi zieleń)
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b
      if (brightness < threshold) {
        data[i + 3] = 0 // przezroczysty
      }
    }

    ctx.putImageData(imageData, 0, 0)

    const img = new Image()
    img.onload = () => resolve(img)
    img.src = canvas.toDataURL('image/png')
  })
}
