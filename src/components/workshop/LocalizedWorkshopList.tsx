import { getLocalizedField } from '@src/sanity/lib/utils/getLocalizedFields'
import type { WORKSHOPS_QUERYResult } from '../../../sanity.types'

import WorkshopList from './WorkshopList'

export default async function LocalizedWorkshopList({
  workshops,
  locale,
}: {
  workshops: WORKSHOPS_QUERYResult
  locale: string
}) {
  const localizedWorkshops = workshops.map((workshop: any) => {
    const title = getLocalizedField(workshop.title, locale)
    const description = getLocalizedField(workshop.description, locale)
    const slugValue = getLocalizedField(workshop.slug, locale)

    // Handle slug - after migration it's stored as a string in the value field
    const slug = slugValue
      ? typeof slugValue === 'string'
        ? { current: slugValue }
        : slugValue
      : null

    return {
      ...workshop,
      title: title || '',
      description: description || '',
      ...(slug && { slug }),
    } as any
  })

  return <WorkshopList workshops={localizedWorkshops} />
}
