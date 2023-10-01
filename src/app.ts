
const { Client, Predicates, ClientConfig } = require('hazelcast-client');
import express from 'express';

const app = express();
app.use(express.json());


const port = process.env.PORT || 3000;
const HAZELCAST_HOST = process.env.HAZELCAST_HOST || 'localhost'
const HAZELCAST_PORT = process.env.HAZELCAST_PORT || 5701


app.get('/', async (req, res) => {

  const data = await main()
  res.appendHeader('content-type', 'application/json')
  res.json({ data: data });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




async function main() {
  // Configure Hazelcast client
  const config = {
    network: {
      clusterMembers:  [`${HAZELCAST_HOST}:${HAZELCAST_PORT}`],
    },
  };
  const client = await Client.newHazelcastClient(config);

  // Get the map named 'myMap'
  const map = await client.getMap('myMap');

  // Add a key-value pair to the map
  await map.put('name', 'mario');

  // Retrieve the value using the key
  const name = await map.get('name');
  // console.log({ values: await map.values() });


  // Shutdown the Hazelcast client when done
  const data = name;
  await client.shutdown();
  return data
}

