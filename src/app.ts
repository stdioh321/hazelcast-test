
const { Client, Predicates, ClientConfig } = require('hazelcast-client');
import express from 'express';

const app = express();
app.use(express.json());


const port = process.env.PORT || 3000;
const HAZELCAST_HOST = process.env.HAZELCAST_HOST || 'localhost'
const HAZELCAST_PORT = process.env.HAZELCAST_PORT || 5701


app.get('/', async (req, res) => {
  const mapName = String(req.query.mapName || '')
  const key = String(req.query.key || '')

  const data = await hazelcastGet(mapName, key)
  res.appendHeader('content-type', 'application/json')
  res.json({ data: data });
});
app.get('/set', async (req, res) => {
  const mapName = String(req.query.mapName || '')
  const key = String(req.query.key || '')
  const value = String(req.query.value || '')

  const data = await hazelcastSet(mapName, key, value)
  res.appendHeader('content-type', 'application/json')
  res.json({ data: data });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




async function hazelcastSet(mapName: string, key: string, value: string) {
  const client = await genHazelcastClient();

  const map = await client.getMap(mapName);

  await map.put(key, value);

  const data = await map.get(key);
  await client.shutdown();
  return data
}

async function hazelcastGet(mapName: string, key: string) {
  const client = await genHazelcastClient();
  let data = null

  const map = await client.getMap(mapName);
  if (!key)
    data = await map.entrySet();
  else
    data = await map.get(key);
  await client.shutdown();
  return data
}

async function genHazelcastClient() {
  const config = {
    network: {
      clusterMembers: [`${HAZELCAST_HOST}:${HAZELCAST_PORT}`],
    },
  };
  const client = await Client.newHazelcastClient(config);
  return client;
}

