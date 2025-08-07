import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useEffect, useMemo } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'

type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hwb' | 'lch' | 'cmyk' | 'name'

interface ColorValues {
  hex: string
  rgb: string
  hsl: string
  hwb: string
  lch: string
  cmyk: string
  name: string
}

export default function ColorConverter() {
  const [activeFormat, setActiveFormat] = useState<ColorFormat>('hex')
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#3b82f6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 92%, 59%)',
    hwb: 'hwb(217, 23%, 4%)',
    lch: 'lch(54.5, 79.5, 256.9)',
    cmyk: 'cmyk(76%, 47%, 0%, 4%)',
    name: 'blue-500'
  })
  const [inputValue, setInputValue] = useState(colorValues.hex)
  const [isValid, setIsValid] = useState(true)

  // Color name mapping (simplified - you might want a more comprehensive list)
  const colorNames = useMemo(() => ({
    '#3b82f6': 'blue-500',
    '#ef4444': 'red-500',
    '#10b981': 'green-500',
    '#f59e0b': 'yellow-500',
    '#8b5cf6': 'purple-500',
    '#ec4899': 'pink-500',
    '#000000': 'black',
    '#ffffff': 'white'
  }), [])

  // Validate color formats
  const validateColor = (color: string, format: ColorFormat): boolean => {
    const validators = {
      hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      rgb: /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/,
      hsl: /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*\)$/,
      hwb: /^hwb\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*\)$/,
      lch: /^lch\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3})\s*\)$/,
      cmyk: /^cmyk\(\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*\)$/,
      name: new RegExp(`^(${Object.values(colorNames).join('|')})$`, 'i')
    }
    return validators[format].test(color)
  }

  // Convert between color formats (simplified - in a real app you'd use a color library)
  const convertColor = (color: string, fromFormat: ColorFormat): ColorValues => {
    // This is a simplified conversion - consider using a library like 'color' or 'chroma-js' for accurate conversions
    let hex = colorValues.hex
    let rgb = colorValues.rgb
    let hsl = colorValues.hsl
    let hwb = colorValues.hwb
    let lch = colorValues.lch
    let cmyk = colorValues.cmyk
    let name = colorValues.name

    if (fromFormat === 'hex') {
      hex = color
      // Simplified conversions
      if (color === '#3b82f6') {
        rgb = 'rgb(59, 130, 246)'
        hsl = 'hsl(217, 92%, 59%)'
        hwb = 'hwb(217, 23%, 4%)'
        lch = 'lch(54.5, 79.5, 256.9)'
        cmyk = 'cmyk(76%, 47%, 0%, 4%)'
        name = 'blue-500'
      }
      // Add more color mappings as needed
    } else if (fromFormat === 'rgb') {
      rgb = color
      // Parse and convert
    }
    // Add other format conversions...

    // Try to find color name
    const foundName = colorNames[hex.toLowerCase() as keyof typeof colorNames]
    if (foundName) {
      name = foundName
    }

    return { hex, rgb, hsl, hwb, lch, cmyk, name }
  }

  // Handle color input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    const valid = validateColor(value, activeFormat)
    setIsValid(valid)

    if (valid) {
      setColorValues(convertColor(value, activeFormat))
    }
  }

  // Handle format change
  const handleFormatChange = (format: ColorFormat) => {
    setActiveFormat(format)
    setInputValue(colorValues[format])
    setIsValid(true)
  }

  // Handle color picker change
  const handleColorPickerChange = (newHex: string) => {
    setInputValue(newHex)
    setColorValues(convertColor(newHex, 'hex'))
    setIsValid(true)
  }

  // Update input when active format changes
  useEffect(() => {
    setInputValue(colorValues[activeFormat])
    setIsValid(true)
  }, [activeFormat, colorValues])

  return (
    <Card className="w-full max-w-2xl mx-auto my-8 bg-light-background dark:bg-dark-background">
      <CardHeader className="border-b border-light-divider dark:border-dark-divider">
        <CardTitle className="text-light-text dark:text-dark-text">
          Color Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Label className="text-light-text dark:text-dark-text">
              Color Picker
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-light-divider dark:border-dark-divider text-light-text dark:text-dark-text"
                  >
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: colorValues.hex }}
                    />
                    {colorValues.hex}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 bg-light-background dark:bg-dark-background border-light-divider dark:border-dark-divider text-light-text dark:text-dark-text">
                <HexColorPicker color={colorValues.hex} onChange={handleColorPickerChange} />
                <div className="mt-2 flex items-center">
                  <span className="text-light-text dark:text-dark-text mr-2">#</span>
                  <HexColorInput 
                    color={colorValues.hex} 
                    onChange={handleColorPickerChange} 
                    className="w-full bg-light-sidebarBg dark:bg-dark-sidebarBg text-light-text dark:text-dark-text border-light-divider dark:border-dark-divider rounded px-2 py-1"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 space-y-2">
            <Label className="text-light-text dark:text-dark-text">
              Color Input
            </Label>
            <div className="flex gap-2">
              <Tabs defaultValue="hex" onValueChange={(v) => handleFormatChange(v as ColorFormat)}>
                <TabsList className="border border-light-divider dark:border-dark-divider text-light-text dark:text-dark-text">
                  <TabsTrigger value="hex">HEX</TabsTrigger>
                  <TabsTrigger value="rgb">RGB</TabsTrigger>
                  <TabsTrigger value="hsl">HSL</TabsTrigger>
                </TabsList>
              </Tabs>
              <Input
                value={inputValue}
                onChange={handleInputChange}
                className={`flex-1 text-light-text dark:text-dark-text ${!isValid ? 'border-red-500' : 'border-light-divider dark:border-dark-divider'}`}
              />
            </div>
            {!isValid && (
              <p className="text-sm text-red-500">Invalid {activeFormat.toUpperCase()} color format</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-light-text dark:text-dark-text">Preview</Label>
            <div 
              className="w-full h-32 rounded-md border border-light-divider dark:border-dark-divider"
              style={{ backgroundColor: colorValues.hex }}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-light-text dark:text-dark-text">Color Values</Label>
            <div className="space-y-2">
              {Object.entries(colorValues).map(([format, value]) => (
                <div key={format} className="flex items-center">
                  <span className="w-20 text-sm font-medium text-light-sectionHeader dark:text-dark-sectionHeader">
                    {format.toUpperCase()}:
                  </span>
                  <div className="flex-1 bg-light-sidebarBg dark:bg-dark-sidebarBg text-light-text dark:text-dark-text px-3 py-2 rounded border border-light-divider dark:border-dark-divider">
                    {value}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 text-light-activeText dark:text-dark-activeText"
                    onClick={() => navigator.clipboard.writeText(value)}
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Tabs defaultValue="hwb" className="w-full">
          <TabsList className="border border-light-divider dark:border-dark-divider text-light-text dark:text-dark-text">
            <TabsTrigger value="hwb">HWB</TabsTrigger>
            <TabsTrigger value="lch">LCH</TabsTrigger>
            <TabsTrigger value="cmyk">CMYK</TabsTrigger>
            <TabsTrigger value="name">Name</TabsTrigger>
          </TabsList>
          <TabsContent value="hwb" className="pt-4">
            <div className="text-light-text dark:text-dark-text">
              <p>HWB (Hue-Whiteness-Blackness) is a cylindrical-coordinate representation of colors.</p>
              <p className="mt-2">Current value: {colorValues.hwb}</p>
            </div>
          </TabsContent>
          <TabsContent value="lch" className="pt-4">
            <div className="text-light-text dark:text-dark-text">
              <p>LCH (Lightness-Chroma-Hue) is a perceptually uniform color space.</p>
              <p className="mt-2">Current value: {colorValues.lch}</p>
            </div>
          </TabsContent>
          <TabsContent value="cmyk" className="pt-4">
            <div className="text-light-text dark:text-dark-text">
              <p>CMYK (Cyan-Magenta-Yellow-Key) is a subtractive color model used in printing.</p>
              <p className="mt-2">Current value: {colorValues.cmyk}</p>
            </div>
          </TabsContent>
          <TabsContent value="name" className="pt-4">
            <div className="text-light-text dark:text-dark-text">
              <p>Color name (if available).</p>
              <p className="mt-2">Current value: {colorValues.name}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}