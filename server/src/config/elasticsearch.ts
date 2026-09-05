import { Client } from "@elastic/elasticsearch";

const node = process.env.ELASTICSEARCH_URL || "http://localhost:9200";
const apiKey = process.env.ELASTICSEARCH_API_KEY;
const username = process.env.ELASTICSEARCH_USERNAME;
const password = process.env.ELASTICSEARCH_PASSWORD;

const elasticsearch = new Client({
  node,
  ...(apiKey
    ? { auth: { apiKey } }
    : username && password
    ? { auth: { username, password } }
    : {}),
});

export default elasticsearch;
