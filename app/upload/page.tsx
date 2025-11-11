'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    tags: '',
    style: '',
    role: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  if (status === 'unauthenticated') {
    router.push('/api/auth/signin')
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('code', formData.code)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('tags', formData.tags)
      formDataToSend.append('style', formData.style)
      formDataToSend.append('role', formData.role)

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      const response = await fetch('/api/avatars', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        alert('Avatar publié avec succès !')
        router.push(`/avatar/${data.data._id}`)
      } else {
        alert(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erreur lors de l\'upload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Partager ton Avatar</h1>
        <p className="text-gray-600">
          Partage ton Code d&apos;Avatar avec la communauté Inazuma Eleven
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouveau Code d&apos;Avatar</CardTitle>
          <CardDescription>
            Remplis les informations de ton avatar pour le partager avec la communauté
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload d'image */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Screenshot de ton avatar *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                {preview ? (
                  <div className="relative w-full max-w-md mx-auto">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={400}
                      height={400}
                      className="rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setPreview(null)
                        setImageFile(null)
                      }}
                      className="mt-4"
                    >
                      Changer l&apos;image
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Clique pour uploader une image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu&apos;à 10MB</p>
                  </label>
                )}
              </div>
            </div>

            {/* Code d'avatar */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Code d&apos;Avatar *
              </label>
              <Textarea
                placeholder="D&wu TDyX uinE mN>U dgpD cqD? c8tY jwt$ !6cM cTFj..."
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Le code unique de ton avatar (visible dans le jeu)
              </p>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium mb-2">Nom de l&apos;avatar *</label>
              <Input
                placeholder="Mon Avatar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Décris ton avatar..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Style & Rôle */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Style</label>
                <Input
                  placeholder="Ex: Technique, Rapide, Fort..."
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rôle</label>
                <Input
                  placeholder="Ex: Attaquant, Défenseur, Gardien..."
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <Input
                placeholder="manga, speed, fire (séparés par des virgules)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Publier mon avatar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
