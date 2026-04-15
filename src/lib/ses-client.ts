import { SESv2Client } from '@aws-sdk/client-sesv2'

export const sesv2 = new SESv2Client({
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const CONTACT_LIST_NAME =
  process.env.AWS_SES_CONTACT_LIST_NAME || 'intetkon'

export const FROM_EMAIL =
  process.env.AWS_SES_FROM_EMAIL || 'Intetkøn <newsletter@intetkon.com>'

export const ORDER_FROM_EMAIL =
  process.env.AWS_SES_ORDER_FROM_EMAIL || 'Intetkøn <order@intetkon.com>'
