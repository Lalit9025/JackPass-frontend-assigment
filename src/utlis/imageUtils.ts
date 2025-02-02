export const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        
        let newWidth, newHeight
        if (img.width / img.height > 4 / 5) {
          newHeight = img.height
          newWidth = (img.height * 4) / 5
        } else {
          newWidth = img.width
          newHeight = (img.width * 5) / 4
        }

        canvas.width = newWidth
        canvas.height = newHeight

        ctx?.drawImage(img, 0, 0, newWidth, newHeight)
        resolve(canvas.toDataURL("image/jpeg"))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

