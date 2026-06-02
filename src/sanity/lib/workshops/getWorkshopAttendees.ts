import { backendClient } from '../backendClient'

export interface WorkshopAttendee {
  email: string
  customerName: string
}

export async function getWorkshopAttendees(
  workshopId: string,
): Promise<WorkshopAttendee[]> {
  const query = `*[_type == "order" && status == "paid" && $workshopId in workshops[]._ref] {
    email,
    customerName
  }`

  const attendees = await backendClient.fetch<WorkshopAttendee[]>(query, {
    workshopId,
  })

  return attendees ?? []
}

export async function getAllWorkshopsForCampaign() {
  const query = `*[_type == "workshop"] | order(date asc) {
    _id,
    title,
    date
  }`

  const workshops = await backendClient.fetch<
    Array<{ _id: string; title: string; date: string }>
  >(query)

  return workshops ?? []
}
