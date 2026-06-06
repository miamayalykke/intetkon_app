export function blockContentToHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  const htmlParts = blocks.map((block) => {
    if (block._type === 'block') {
      const style = block.style || 'normal'
      const text = block.children
        ?.map((child: any) => {
          let content = child.text || ''
          if (child.marks) {
            if (child.marks.includes('strong')) {
              content = `<strong>${content}</strong>`
            }
            if (child.marks.includes('em')) {
              content = `<em>${content}</em>`
            }
            if (child.marks.includes('code')) {
              content = `<code>${content}</code>`
            }
          }

          if (child._type === 'span' && child.marks) {
            const linkMark = child.marks.find(
              (mark: any) => typeof mark === 'object' && mark?._type === 'link',
            )
            if (linkMark?.href) {
              content = `<a href="${linkMark.href}">${content}</a>`
            }
          }

          return content
        })
        .join('')

      if (style === 'h1')
        return `<h1 style="font-size: 24px; font-weight: bold; margin: 16px 0 8px 0; color: #1a1a1a;">${text}</h1>`
      if (style === 'h2')
        return `<h2 style="font-size: 20px; font-weight: bold; margin: 14px 0 8px 0; color: #1a1a1a;">${text}</h2>`
      if (style === 'h3')
        return `<h3 style="font-size: 18px; font-weight: bold; margin: 12px 0 8px 0; color: #1a1a1a;">${text}</h3>`
      if (style === 'h4')
        return `<h4 style="font-size: 16px; font-weight: bold; margin: 10px 0 8px 0; color: #1a1a1a;">${text}</h4>`
      if (style === 'blockquote')
        return `<blockquote style="border-left: 3px solid #ccc; padding-left: 12px; margin: 12px 0; color: #666; font-style: italic;">${text}</blockquote>`

      if (block.listItem) {
        if (block.listItem === 'bullet') {
          return `<li style="margin-left: 20px; margin-bottom: 4px;">${text}</li>`
        }
      }

      return `<p style="margin: 0 0 12px 0; line-height: 20px;">${text}</p>`
    }

    if (block._type === 'image') {
      const alt = block.alt || 'Image'
      return `<img src="${block.asset?.url || ''}" alt="${alt}" style="max-width: 100%; height: auto; margin: 12px 0;" />`
    }

    return ''
  })

  let result = ''
  let inList = false

  for (const html of htmlParts) {
    if (!html) continue

    if (html.startsWith('<li')) {
      if (!inList) {
        result += '<ul style="margin: 12px 0; padding: 0;">'
        inList = true
      }
      result += html
    } else {
      if (inList) {
        result += '</ul>'
        inList = false
      }
      result += html
    }
  }

  if (inList) {
    result += '</ul>'
  }

  return result
}
