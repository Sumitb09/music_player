export const resolveImage = (item: any): string => {
    if (!item) return fallback
  
    // Case 1: image is string
    if (typeof item.image === 'string') {
      return item.image
    }
  
    // Case 2: image is array
    if (Array.isArray(item.image)) {
      const highest =
        item.image.find((img: any) =>
          img.quality?.includes('500')
        ) ||
        item.image[2] ||
        item.image[1] ||
        item.image[0]
  
      return highest?.url || highest?.link || fallback
    }
  
    // Case 3: nested image object
    if (item.image?.url) return item.image.url
    if (item.image?.link) return item.image.link
  
    return fallback
  }
  
  const fallback =
    'https://via.placeholder.com/300x300.png?text=Music'