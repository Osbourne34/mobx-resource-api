import { Button, Flex, Typography } from 'antd'

export const Counter = ({
  onDec,
  onInc,
  onReset,
  counter,
}: {
  onInc?: () => void
  onDec?: () => void
  onReset?: () => void
  counter: number
}) => {
  return (
    <Flex gap="small" align="center">
      <Button onClick={onInc}>+1</Button>
      <Typography.Text>{counter}</Typography.Text>
      <Button onClick={onDec}>-1</Button>

      {onReset && <Button onClick={onReset}>Reset</Button>}
    </Flex>
  )
}
