/**
 * Resizes an image to a maximum width to save LocalStorage space.
 */
export const resizeImage = (file: File, maxWidth: number = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const elem = document.createElement('canvas');
        const scaleFactor = maxWidth / img.width;
        
        // Only resize if image is larger than maxWidth
        if (scaleFactor < 1) {
            elem.width = maxWidth;
            elem.height = img.height * scaleFactor;
        } else {
            elem.width = img.width;
            elem.height = img.height;
        }
        
        const ctx = elem.getContext('2d');
        if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
        }
        ctx.drawImage(img, 0, 0, elem.width, elem.height);
        // Compress to JPEG with 0.7 quality to save space
        resolve(ctx.canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
