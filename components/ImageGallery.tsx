'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(src)}
            />
          </div>
        ))}
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-3xl aspect-square">
            <Image
              src={selectedImage}
              alt="Expanded image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}

