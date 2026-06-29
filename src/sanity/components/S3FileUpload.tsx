import { Button, Stack, Text } from '@sanity/ui'
import { useCallback, useRef, useState } from 'react'
import type { StringInputProps } from 'sanity'
import { set, useClient } from 'sanity'

export function S3FileUpload(props: StringInputProps) {
  const { onChange, value } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const client = useClient({ apiVersion: '2024-01-01' })
  const sanityToken = client.config().token

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setIsUploading(true)
      setError(null)
      try {
        const res = await fetch('/api/s3-upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(sanityToken ? { 'x-sanity-token': sanityToken } : {}),
          },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        })
        if (!res.ok) throw new Error('Failed to get upload URL')
        const { uploadUrl, key } = await res.json()
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        if (!uploadRes.ok) throw new Error('S3 upload failed')
        onChange(set(key))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setIsUploading(false)
        if (inputRef.current) inputRef.current.value = ''
      }
    },
    [onChange, sanityToken],
  )

  return (
    <Stack space={3}>
      {value && (
        <Text size={1} muted>
          Current key: {value}
        </Text>
      )}
      <Button
        text={isUploading ? 'Uploading…' : 'Upload file to S3'}
        tone="primary"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      />
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {error && (
        <Text
          size={1}
          style={{ color: 'var(--card-badge-critical-dot-color)' }}
        >
          {error}
        </Text>
      )}
    </Stack>
  )
}
