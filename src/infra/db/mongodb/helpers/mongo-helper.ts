import { MongoClient, Collection, ObjectId } from "mongodb";

export const mongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect(url: string): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url);
    }

    return this.client.db().collection(name);
  },

  toId(id: string): ObjectId {
    return new ObjectId(id);
  },

  map<T = unknown>(collection): T {
    const { _id, ...collectionWithoutId } = collection;

    return { ...collectionWithoutId, id: _id.toString() };
  },
};
