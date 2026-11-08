export function isUnderConstruction(): boolean {
  if (process.env.UNDER_CONSTRUCTION !== 'true') return false

  if (process.env.NODE_ENV !== 'development') return true

  return process.env.UNDER_CONSTRUCTION_ON_LOCALHOST === 'true'
}
