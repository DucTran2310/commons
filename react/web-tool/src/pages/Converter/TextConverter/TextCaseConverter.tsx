import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useDebounce from '@/hooks/useDebounce'
import { useState, useEffect, useMemo, useCallback } from 'react'

type CaseType =
  | 'lowercase' | 'uppercase' | 'camelcase' | 'capitalcase'
  | 'constantcase' | 'dotcase' | 'headercase' | 'nocase'
  | 'paramcase' | 'pascalcase' | 'pathcase' | 'sentencecase'
  | 'snakecase' | 'mockingcase'

interface ConversionResult {
  type: CaseType
  label: string
  value: string
}

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState('')
  const debouncedText = useDebounce(inputText, 300)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedConversions, setSelectedConversions] = useState<Record<CaseType, boolean>>(
    Object.fromEntries([
      'lowercase', 'uppercase', 'camelcase', 'capitalcase',
      'constantcase', 'dotcase', 'headercase', 'nocase',
      'paramcase', 'pascalcase', 'pathcase', 'sentencecase',
      'snakecase', 'mockingcase'
    ].map(type => [type, true])) as Record<CaseType, boolean>
  )

  // Memoized conversion functions
  const convertToCase = useMemo(() => ({
    lowercase: (text: string) => text.toLowerCase(),
    uppercase: (text: string) => text.toUpperCase(),
    camelcase: (text: string) => {
      return text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return ''
        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      }).replace(/[^\w]/g, '')
    },
    capitalcase: (text: string) => {
      return text.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')
    },
    constantcase: (text: string) => text.replace(/\s+/g, '_').toUpperCase(),
    dotcase: (text: string) => text.replace(/\s+/g, '.').toLowerCase(),
    headercase: (text: string) => text.replace(/\s+/g, '-').split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('-'),
    nocase: (text: string) => text,
    paramcase: (text: string) => text.replace(/\s+/g, '-').toLowerCase(),
    pascalcase: (text: string) => {
      return text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => {
        if (+match === 0) return ''
        return match.toUpperCase()
      }).replace(/[^\w]/g, '')
    },
    pathcase: (text: string) => text.replace(/\s+/g, '/').toLowerCase(),
    sentencecase: (text: string) => {
      if (text.length === 0) return ''
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    },
    snakecase: (text: string) => text.replace(/\s+/g, '_').toLowerCase(),
    mockingcase: (text: string) => {
      return text.split('').map((char, index) =>
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      ).join('')
    }
  }), [])

  // Generate conversions
  // Update the generateConversions function to handle type safety
  const generateConversions = useCallback((text: string): ConversionResult[] => {
    if (!text.trim()) return []

    const allConversions: ConversionResult[] = [
      { type: 'lowercase', label: 'Lowercase', value: convertToCase.lowercase(text) },
      { type: 'uppercase', label: 'Uppercase', value: convertToCase.uppercase(text) },
      { type: 'camelcase', label: 'Camelcase', value: convertToCase.camelcase(text) },
      { type: 'capitalcase', label: 'Capitalcase', value: convertToCase.capitalcase(text) },
      { type: 'constantcase', label: 'Constantcase', value: convertToCase.constantcase(text) },
      { type: 'dotcase', label: 'Dotcase', value: convertToCase.dotcase(text) },
      { type: 'headercase', label: 'Headercase', value: convertToCase.headercase(text) },
      { type: 'nocase', label: 'Nocase', value: convertToCase.nocase(text) },
      { type: 'paramcase', label: 'Paramcase', value: convertToCase.paramcase(text) },
      { type: 'pascalcase', label: 'Pascalcase', value: convertToCase.pascalcase(text) },
      { type: 'pathcase', label: 'Pathcase', value: convertToCase.pathcase(text) },
      { type: 'sentencecase', label: 'Sentencecase', value: convertToCase.sentencecase(text) },
      { type: 'snakecase', label: 'Snakecase', value: convertToCase.snakecase(text) },
      { type: 'mockingcase', label: 'Mockingcase', value: convertToCase.mockingcase(text) },
    ]

    return allConversions.filter(conv => selectedConversions[conv.type as CaseType])
  }, [convertToCase, selectedConversions])

  // Memoized conversions
  const conversions = useMemo(() => {
    return generateConversions(debouncedText)
  }, [debouncedText, generateConversions])

  // Handle copy to clipboard
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Toggle all conversions
  const toggleAllConversions = () => {
    const newState = !selectAll
    setSelectAll(newState)
    setSelectedConversions(prev => {
      const newSelections = { ...prev }
      Object.keys(newSelections).forEach(key => {
        newSelections[key as CaseType] = newState
      })
      return newSelections
    })
  }

  // Toggle individual conversion
  const toggleConversion = (type: CaseType) => {
    setSelectedConversions(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  // Update selectAll when individual checkboxes change
  useEffect(() => {
    const allSelected = Object.values(selectedConversions).every(Boolean)
    setSelectAll(allSelected)
  }, [selectedConversions])

  return (
    <Card className="w-full max-w-4xl mx-auto bg-light-background dark:bg-dark-background my-8">
      <CardHeader className="border-b border-light-divider dark:border-dark-divider">
        <CardTitle className="text-light-text dark:text-dark-text">
          Text Case Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="input-text" className="text-light-text dark:text-dark-text">
            Your string:
          </Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to convert..."
            className="min-h-[100px] font-mono bg-light-sidebarBg dark:bg-dark-sidebarBg 
                      text-light-text dark:text-dark-text border-light-divider dark:border-dark-divider"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 p-4 bg-light-hoverBg dark:bg-dark-hoverBg rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="select-all"
              checked={selectAll}
              onCheckedChange={toggleAllConversions}
              className="border-light-divider dark:border-dark-divider"
            />
            <Label htmlFor="select-all" className="text-light-text dark:text-dark-text">
              Select all
            </Label>
          </div>
          
          {Object.entries(selectedConversions).map(([type, checked]) => {
            const caseType = type as CaseType
            return (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`checkbox-${type}`}
                  checked={checked}
                  onCheckedChange={() => toggleConversion(caseType)}
                  className="border-light-divider dark:border-dark-divider"
                />
                <Label 
                  htmlFor={`checkbox-${type}`} 
                  className="capitalize text-light-text dark:text-dark-text"
                >
                  {type.replace('case', '')}
                </Label>
              </div>
            )
          })}
        </div>

        {conversions.length > 0 ? (
          <div className="space-y-4">
            {conversions.map((conversion, index) => (
              <div key={conversion.type} className="flex items-center gap-4">
                <Label className="w-32 shrink-0 text-light-text dark:text-dark-text">
                  {conversion.label}:
                </Label>
                <Input
                  value={conversion.value}
                  readOnly
                  className="flex-1 font-mono bg-light-sidebarBg dark:bg-dark-sidebarBg 
                            text-light-text dark:text-dark-text border-light-divider dark:border-dark-divider"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(conversion.value, index)}
                  className="w-24 bg-light-activeBg dark:bg-dark-activeBg 
                            text-light-activeText dark:text-dark-activeText
                            border-light-divider dark:border-dark-divider
                            hover:bg-light-hoverBg dark:hover:bg-dark-hoverBg"
                >
                  {copiedIndex === index ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-light-sectionHeader dark:text-dark-sectionHeader">
            {inputText ? 'No conversions selected' : 'Enter text to see conversions'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}