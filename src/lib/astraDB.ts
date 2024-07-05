import { DataAPIClient, VectorDoc, UUID, Db } from "@datastax/astra-db-ts";

const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT } = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
export const db: Db = client.db(ASTRA_DB_API_ENDPOINT!);

console.log(`* Connected to DB ${db.id}`);
