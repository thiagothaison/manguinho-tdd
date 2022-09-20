import { mongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import env from "./config/env";

mongoHelper
  .connect(env.getMongoUrl())
  .then(async () => {
    const app = (await import("./config/app")).default;

    app.listen(env.httpPort, () =>
      console.log(`Server running at http://localhost:${env.httpPort}`)
    );
  })
  .catch(console.error);
