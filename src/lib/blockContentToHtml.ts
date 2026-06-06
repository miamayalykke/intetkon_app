export function blockContentToHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
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
                (mark: any) => typeof mark === 'object' && mark._type === 'link',
              )
              if (linkMark && linkMark.href) {
                content = `<a href="${linkMark.href}">${content}</a>`
              }
            }

            return content
          })
          .join('')

        if (style === 'h1') return `<h1>${text}</h1>`
        if (style === 'h2') return `<h2>${text}</h2>`
        if (style === 'h3') return `<h3>${text}</h3>`
        if (style === 'h4') return `<h4>${text}</h4>`
        if (style === 'blockquote') return `<blockquote>${text}</blockquote>`

        if (block.listItem) {
          if (block.listItem === 'bullet') {
            return `<li>${text}</li>`
          }
        }

        return `<p>${text}</p>`
      }

      if (block._type === 'image') {
        const alt = block.alt || 'Image'
        return `<img src="${block.asset?.url || ''}" alt="${alt}" />`
      }

      return ''
    })
    .filter(Boolean)
    .reduce((acc: string, html: string) => {
      if (html.startsWith('<li>')) {
        if (!acc.endsWith('</ul>')) {
          acc += '<ul>'
        }
        return acc + html
      }
      if (acc.includes('<ul>') && !acc.endsWith('</ul>') && !html.startsWith('<li>')) {
        acc += '</ul>'
      }
      return acc + html
    }, '')
    .replace(/<\/ul>$/, '</ul>')
}
