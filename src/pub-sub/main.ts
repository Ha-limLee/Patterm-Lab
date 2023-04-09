import { createChannel, useChannel } from "./channel";

type Cafe = {
  espresso: number;
  americano: number;
}

const id = createChannel<Cafe>();

function main() {
  const { publish, subscribe } = useChannel<Cafe>(id);
  const address = 'cafe';
  publish(address)({ espresso: 1_500, americano: 2_000 });
  subscribe(address)((data) => {
    console.log(`====== paid ${data.espresso} for espresso ======`);
  });
}

main();