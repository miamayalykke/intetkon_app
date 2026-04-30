import { Box, Button, Flex } from '@sanity/ui'
import { type StringInputProps, set } from 'sanity'

export function CouponCodeInput(props: StringInputProps) {
  const { onChange, renderDefault } = props

  const handleGenerate = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    onChange(set(code))
  }

  return (
    <Flex gap={2} align="flex-end">
      <Box flex={1}>{renderDefault(props)}</Box>
      <Button text="Generate random" onClick={handleGenerate} mode="ghost" tone="primary" />
    </Flex>
  )
}
