export interface Workshop {
  _id: string
  title: string
  slug: { current: string }
  description: string
  date: string
  duration: string // e.g., "4 Hours"
  price: number
  location: string
  maxAllocation: number
  currentSignUps: number
  image?: any
  level: 'Beginner' | 'Intermediate' | 'Advanced'
}
