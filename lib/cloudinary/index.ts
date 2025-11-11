import { v2 as cloudinary } from 'cloudinary'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
}

/**
 * Upload une image vers Cloudinary
 */
export async function uploadImage(
  file: File,
  folder: string = 'inazuma-avatars'
): Promise<UploadResult> {
  try {
    // Convertir le File en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload vers Cloudinary avec promise
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [
              { width: 1000, height: 1000, crop: 'limit' },
              { quality: 'auto:good' },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error('Upload failed'))
            } else {
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
              })
            }
          }
        )
        .end(buffer)
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Supprime une image de Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image')
  }
}

export default cloudinary
