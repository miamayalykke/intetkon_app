import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Next.js owns the page cache. Fetch directly from Sanity when an ISR page
  // is generated so webhook-triggered revalidation cannot repopulate it with
  // a stale CDN response.
  useCdn: false,
})
