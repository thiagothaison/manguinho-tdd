export default {
  mongoHost: process.env.MONGO_HOST || "localhost",
  mongoPort: +process.env.MONGO_PORT || 27017,
  mongoDatabaseName: process.env.MONGO_HOST || "clean-node-api",

  getMongoUrl() {
    return (
      process.env.MONGO_URL ||
      `mongodb://${this.mongoHost}:${this.mongoPort}/${this.mongoDatabaseName}`
    );
  },

  httpPort: process.env.HTTP_PORT || 5050,

  jwtSecret: process.env.JWT_SECRET || "Yoda",
};
