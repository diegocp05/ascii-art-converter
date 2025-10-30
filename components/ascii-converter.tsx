"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload, Copy, Download, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const CHARACTER_SETS = {
  standard: "@%#*+=-:. ",
  detailed: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  block: "█▓▒░ ",
  minimal: "█░ ",
}

type CharacterSetKey = keyof typeof CHARACTER_SETS

export function AsciiConverter() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [asciiArt, setAsciiArt] = useState<string>("")
  const [coloredAscii, setColoredAscii] = useState<{ char: string; color: string }[][]>([])
  const [resolution, setResolution] = useState<number>(100)
  const [invertColors, setInvertColors] = useState<boolean>(false)
  const [grayscale, setGrayscale] = useState<boolean>(true)
  const [characterSet, setCharacterSet] = useState<CharacterSetKey>("standard")
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const convertToAscii = useCallback(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    const aspectRatio = image.width / image.height
    const width = resolution
    const height = Math.floor(resolution / aspectRatio / 2)

    canvas.width = width
    canvas.height = height

    ctx.drawImage(image, 0, 0, width, height)
    const imageData = ctx.getImageData(0, 0, width, height)
    const pixels = imageData.data

    const chars = CHARACTER_SETS[characterSet]
    let ascii = ""
    const colored: { char: string; color: string }[][] = []

    for (let y = 0; y < height; y++) {
      const row: { char: string; color: string }[] = []
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4
        const r = pixels[offset]
        const g = pixels[offset + 1]
        const b = pixels[offset + 2]

        const brightness = (r + g + b) / 3
        const adjustedBrightness = invertColors ? 255 - brightness : brightness
        const charIndex = Math.floor((adjustedBrightness / 255) * (chars.length - 1))
        const char = chars[charIndex]

        ascii += char
        row.push({
          char,
          color: `rgb(${r}, ${g}, ${b})`,
        })
      }
      ascii += "\n"
      colored.push(row)
    }

    setAsciiArt(ascii)
    setColoredAscii(colored)
  }, [image, resolution, invertColors, characterSet])

  useEffect(() => {
    if (image) {
      convertToAscii()
    }
  }, [image, resolution, invertColors, characterSet, convertToAscii])

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de imagem válido.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        toast({
          title: "Sucesso!",
          description: "Imagem carregada e convertida.",
        })
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(asciiArt)
    toast({
      title: "Copiado!",
      description: "Arte ASCII copiada para a área de transferência.",
    })
  }

  const downloadAscii = () => {
    const blob = new Blob([asciiArt], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ascii-art.txt"
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Download iniciado!",
      description: "Sua arte ASCII está sendo baixada.",
    })
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            Transforme <span className="text-primary">Imagens</span> em{" "}
            <span className="text-secondary">Arte ASCII</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Converta suas fotos em arte de texto com caracteres ASCII. Personalize o estilo e baixe o resultado.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Area */}
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Upload da Imagem</h2>
              <p className="text-sm text-muted-foreground">Arraste e solte ou clique para selecionar uma imagem</p>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                className="hidden"
              />
              <div className="space-y-4">
                {image ? (
                  <ImageIcon className="w-16 h-16 mx-auto text-primary" />
                ) : (
                  <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                )}
                <div>
                  <p className="text-lg font-medium">{image ? "Imagem carregada!" : "Clique ou arraste uma imagem"}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {image ? "Clique para trocar a imagem" : "PNG, JPG, GIF até 10MB"}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="resolution" className="text-base font-medium">
                    Resolução
                  </Label>
                  <span className="text-sm text-muted-foreground font-sans">{resolution}px</span>
                </div>
                <Slider
                  id="resolution"
                  min={50}
                  max={200}
                  step={10}
                  value={[resolution]}
                  onValueChange={(value) => setResolution(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="charset" className="text-base font-medium">
                  Conjunto de Caracteres
                </Label>
                <Select value={characterSet} onValueChange={(value) => setCharacterSet(value as CharacterSetKey)}>
                  <SelectTrigger id="charset">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Padrão</SelectItem>
                    <SelectItem value="detailed">Detalhado</SelectItem>
                    <SelectItem value="block">Blocos</SelectItem>
                    <SelectItem value="minimal">Minimalista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <Label htmlFor="invert" className="text-base font-medium cursor-pointer">
                  Inverter Cores
                </Label>
                <Switch id="invert" checked={invertColors} onCheckedChange={setInvertColors} />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <Label htmlFor="grayscale" className="text-base font-medium cursor-pointer">
                  Modo Escala de Cinza
                </Label>
                <Switch id="grayscale" checked={grayscale} onCheckedChange={setGrayscale} />
              </div>
            </div>
          </Card>

          {/* Preview Area */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">Resultado</h2>
                <p className="text-sm text-muted-foreground">Sua arte ASCII aparecerá aqui</p>
              </div>
              {asciiArt && (
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button onClick={downloadAscii} variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="relative min-h-[400px] bg-muted/30 rounded-lg p-4 overflow-auto">
              {asciiArt ? (
                <div className="font-mono text-[6px] leading-[6px] whitespace-pre select-all">
                  {grayscale ? (
                    <span className="text-foreground">{asciiArt}</span>
                  ) : (
                    coloredAscii.map((row, y) => (
                      <div key={y}>
                        {row.map((cell, x) => (
                          <span key={x} style={{ color: cell.color }}>
                            {cell.char}
                          </span>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-2">
                    <ImageIcon className="w-12 h-12 mx-auto opacity-50" />
                    <p className="text-sm">Faça upload de uma imagem para começar</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
