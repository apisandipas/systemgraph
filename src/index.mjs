import express from "express";
import { buildSchema } from "graphql";
import os from "os";
import path from "path";

import { graphqlHTTP } from "express-graphql";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hostname: String
    os: String
    arch: String
    kernel: String
    uptime: String
    memFree: String
    cpuLoad: String
    user: User
  }

  type User {
    homeDir: String
    whoami: String
    shell: String
  }
`);

// The root provides a resolver function for each API endpoint
const rootValue = {
  hostname: () => os.hostname(),
  os: () => os.platform(),
  arch: () => os.arch(),
  kernel: () => os.release(),
  uptime: () => os.uptime(),
  memFree: () => os.freemem(),
  cpuLoad: () => os.loadavg()[0],
  user: {
    homeDir: () => os.userInfo().homedir,
    whoami: () => os.userInfo().username,
    shell: () => os.userInfo().shell,
  },
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: { headerEditorEnabled: true },
  })
);

app.use("/", express.static(path.join(__dirname, "public")));

app.listen(4000);

console.log("Running a GraphQL API server at http://localhost:4000/graphql");
