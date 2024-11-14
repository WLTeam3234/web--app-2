'use client'

import { useState, useRef } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Download, Upload } from 'lucide-react'
import logo from "../public/images/logo.png"
import example from "../public/images/example.png"

export default function BackgroundRemover() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setOriginalImage(e.target?.result as string)  
      reader.readAsDataURL(file)
    }
  }

  const removeBackground = async () => {
    if (!fileInputRef.current?.files?.[0]) return

    setIsProcessing(true)

    const apiKey = 'CYBu4LmA2KRHGHqBEraLoNpc'
    const file = fileInputRef.current.files[0]

    const formData = new FormData()
    formData.append('image_file', file)
    formData.append('size', 'auto')

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to process image')

      const blob = await response.blob()
      setProcessedImage(URL.createObjectURL(blob))
    } catch (error) {
      console.error('Error removing background:', error)
      alert('Failed to remove background. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      link.download = 'processed-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image src={logo} alt="Logo" width={32} height={32} />
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="text-gray-500 hover:text-gray-900">Tools</a></li>
                <li><a href="#" className="text-gray-500 hover:text-gray-900">API</a></li>
                <li><a href="#" className="text-gray-500 hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="text-gray-500 hover:text-gray-900">Blog</a></li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Log in</Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Free Image Background Remover</h1>
          <p className="text-xl text-gray-600">Remove background from images automatically in just a few seconds</p>
        </div>

        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md mb-6">
                <Label htmlFor="file-upload" className="sr-only">Choose file</Label>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              <Button className="mb-6" onClick={removeBackground} disabled={!originalImage || isProcessing}>
                {isProcessing ? 'Processing...' : 'Remove Background'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {originalImage ? (
                    // <Image src={originalImage} alt="Original" layout="responsive" objectFit="contain" />
                    <div className="relative w-full overflow-hidden rounded-lg border">
                      <Image
                        src={originalImage}
                        alt="Original"
                        layout="responsive"
                        width={400}
                        height={400}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-400">Original Image</p>
                  )}
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {processedImage ? (
                    // <Image src={processedImage} alt="Processed" layout="responsive" objectFit="contain" />
                    <div className="relative w-full overflow-hidden rounded-lg border">
                    <Image
                      src={processedImage}
                      alt="Original"
                      layout="responsive"
                      width={400}
                      height={400}
                      className="object-contain"
                    />
                  </div>
                  ) : (
                    <p className="text-gray-400">Processed Image</p>
                  )}
                </div>
              </div>
              <Button className="mt-6" onClick={handleDownload} disabled={!processedImage}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Upload Image</h3>
              <p className="text-sm text-gray-600">Select any image from your device</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Remove Background</h3>
              <p className="text-sm text-gray-600">Our AI will process and remove the background</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Download Result</h3>
              <p className="text-sm text-gray-600">Get your image with background removed</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Instant and automatic background remover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-4">Our AI-powered background remover automatically detects the main subject in your image and removes the background instantly. Whether you want to remove the background from a portrait, product image, or any other photo, our tool makes it quick and easy.</p>
              <p>With our advanced algorithms, you can achieve professional-looking results without any manual editing. Simply upload your image, and let our AI do the rest. It's perfect for e-commerce product photos, professional headshots, or creative photo editing.</p>
            </div>
            <div className="flex items-center justify-center">
              <Image src={example} alt="Example-bg" width={400} height={400} className="rounded-lg" />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Features</a></li>
                <li><a href="#" className="hover:underline">Pricing</a></li>
                <li><a href="#" className="hover:underline">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Documentation</a></li>
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
                <li><a href="#" className="hover:underline">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
