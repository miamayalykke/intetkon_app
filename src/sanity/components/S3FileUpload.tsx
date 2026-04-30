'use client'

import { useCallback, useRef, useState } from 'react'
import { set, StringInputProps, unset } from 'sanity'
import { Box, Button, Card, Flex, Spinner, Stack, Text } from '@sanity/ui'
import { TrashIcon, UploadIcon } from '@sanity/icons'

export function S3FileUpload(props: StringInputProps) {
  const { value, onChange } = props
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)
      setError(null)

      try {
        // 1. Get presigned upload URL
        const res = await fetch('/api/s3-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        })

        if (!res.ok) {
          throw new Error('Failed to get upload URL')
        }

        const { uploadUrl, key } = await res.json()

        // 2. Upload directly to S3
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })

        if (!uploadRes.ok) {
          throw new Error('Failed to upload file to S3')
        }

        // 3. Store the S3 key in the Sanity field
        onChange(set(key))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [onChange],
  )

  const handleClear = useCallback(() => {
    onChange(unset())
    setError(null)
  }, [onChange])

  return (
    <Stack space={3}>
      {value ? (
        <Card padding={3} radius={2} shadow={1} tone="positive">
          <Flex align="center" justify="space-between" gap={3}>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                File uploaded
              </Text>
              <Text size={1} muted>
                {value}
              </Text>
            </Stack>
            <Flex gap={2}>
              <Button
                icon={UploadIcon}
                text="Replace"
                tone="primary"
                mode="ghost"
                fontSize={1}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              />
              <Button
                icon={TrashIcon}
                text="Remove"
                tone="critical"
                mode="ghost"
                fontSize={1}
                onClick={handleClear}
                disabled={uploading}
              />
            </Flex>
          </Flex>
        </Card>
      ) : (
        <Card padding={3} radius={2} shadow={1}>
          <Flex align="center" gap={3}>
            {uploading ? (
              <>
                <Spinner muted />
                <Text size={1} muted>
                  Uploading…
                </Text>
              </>
            ) : (
              <Button
                icon={UploadIcon}
                text="Upload file to S3"
                tone="primary"
                onClick={() => fileInputRef.current?.click()}
              />
            )}
          </Flex>
        </Card>
      )}

      {error && (
        <Card padding={3} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      )}

      <Box style={{ display: 'none' }}>
        <input ref={fileInputRef} type="file" onChange={handleFileChange} />
      </Box>
    </Stack>
  )
}
