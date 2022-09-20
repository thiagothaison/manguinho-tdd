import { MongoClient, Collection } from "mongodb";

export const mongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  map<T = unknown>(collection): T {
    const { _id, ...collectionWithoutId } = collection;

    return { ...collectionWithoutId, id: _id.toString() };
  },
};
