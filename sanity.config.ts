'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
