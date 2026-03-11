import { Button, Flex, Typography } from "antd";
import { globalCounterStore } from "../stores/global-counter-store";
import { observer } from "mobx-react";

export const Counter = observer(() => {
  return (
    <Flex gap="small" align="center">
      <Button onClick={() => globalCounterStore.inc()}>+1</Button>
      <Typography.Text>{globalCounterStore.counter}</Typography.Text>
      <Button onClick={() => globalCounterStore.dec()}>-1</Button>

      <Button onClick={() => globalCounterStore.reset()}>Reset</Button>
    </Flex>
  );
});
