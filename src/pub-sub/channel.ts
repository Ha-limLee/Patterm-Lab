type Channel<T> = {
  id: string;
  prev: { [address: string]: T };
  state: { [address: string]: T };
};

const publish = <T> (channel: Channel<T>) => (address: string) => (data: T) => {
  [channel.prev, channel.state] = [channel.state, channel.prev];
  channel.state[address] = data;
  return channel;
};

const subscribe = <T>(channel: Channel<T>) => (address: string) => (listener: (data: T) => void) => {
  listener(channel.state[address]);
};

function* createKey() {
  let prev = String(Date.now() + Math.random());
  yield prev;
  while (true) {
    let next = String(Date.now() + Math.random());
    while (prev === next)
      next = String(Date.now() + Math.random());
    yield (prev = next);
  }
}

const channels: { [id: string]: Channel<unknown> } = {};

const create = (gen: Generator<string, void, unknown>) => <T>() => {
  const { done, value } = gen.next();
  const id = done ? '' : value;
  const channel: Channel<T> = { id, prev: {}, state: {} };
  channels[id] = channel;
  return id;
}

const createChannel = create(createKey());

const useChannel = <T>(id: string) => {
  const channel = channels[id] as Channel<T>;
  return {
    publish: publish(channel),
    subscribe: subscribe(channel)
  };
};

export { createChannel, useChannel };
