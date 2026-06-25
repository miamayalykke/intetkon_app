import { Download } from 'lucide-react'

export interface S3FileItem {
  s3Key: string
  filename?: string
}

export interface DigitalProductFilesProps {
  files: S3FileItem[] | undefined
  locale: 'en' | 'da'
  productId: string
  sessionToken?: string
  variant?: 'page' | 'email'
  t?: {
    download: string
    downloadLabel: (lang: string) => string
  }
}

/**
 * Reusable component to display digital product files on the orders page.
 */
export function DigitalProductFiles({
  files,
  locale,
  productId,
  sessionToken,
  t = {
    download: locale === 'da' ? 'Download' : 'Download',
    downloadLabel: (lang: string) => lang.toUpperCase(),
  },
}: Omit<DigitalProductFilesProps, 'variant'>) {
  if (!files || files.length === 0) return null

  return (
    <div className="flex flex-col gap-1 mt-1">
      {files.map((file, index) => {
        const downloadUrl = sessionToken
          ? `/api/download/${productId}?session=${sessionToken}&locale=${locale}&index=${index}`
          : `/api/download/${productId}?locale=${locale}&index=${index}`

        const fileName =
          file.filename && file.filename.trim()
            ? file.filename
            : `${t.downloadLabel(locale)} ${index + 1}`

        return (
          <a
            key={index}
            href={downloadUrl}
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-secondary/70 transition-colors"
          >
            <Download className="w-3 h-3" />
            {fileName}
          </a>
        )
      })}
    </div>
  )
}

/**
 * Get file download URLs for email templates.
 * Returns array of { label, url } objects ready for email rendering.
 */
export function getFileDownloadUrls(
  files: S3FileItem[] | undefined,
  locale: 'en' | 'da',
  productId: string,
  sessionToken: string,
  labels?: { label: string; lang: string },
) {
  if (!files || files.length === 0) return []

  return files.map((file, index) => ({
    label:
      file.filename && file.filename.trim()
        ? `${file.filename} (${labels?.label || locale.toUpperCase()})`
        : `${labels?.label || locale.toUpperCase()} ${index + 1}`,
    url: `/api/download/${productId}?session=${sessionToken}&locale=${locale}&index=${index}`,
  }))
}
