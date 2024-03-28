import * as dotenv from 'dotenv';
dotenv.config();
import { ApplicationConfig, BetazApiApplication } from './application';
import * as mongoDB from "mongodb";
import { DbDataSource } from "./datasources";
import {ApiPromise, WsProvider} from "@polkadot/api";
import jsonrpc from "@polkadot/types/interfaces/jsonrpc";
import { global_vars, SOCKET_STATUS} from "./utils/constant";

export * from './application';

export let globalApi: ApiPromise;
export let localApi: ApiPromise;

export async function connectToDatabase() {
  const db_host: string = DbDataSource.defaultConfig.host || "127.0.0.1";
  const db_post: string = DbDataSource.defaultConfig.port || "27017";
  const dbUrl: string = `mongodb://${db_host}:${db_post}`;
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(dbUrl);
  await client.connect();

  const db: mongoDB.Db = client.db(DbDataSource.defaultConfig.name);

  console.log(`Successfully connected to database: ${db.databaseName}`);
}

export async function main(options: ApplicationConfig = {}) {
  const app = new BetazApiApplication(options);

  // JOB

  // CONNECT DB
  connectToDatabase().then(() => {
    console.log(`Connected DB`);
  });

  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  // CONNECT ALEPHZERO CHAIN
  try {
    const provider = new WsProvider(process.env.ALEPHZERO_PROVIDER_URL);
    globalApi = new ApiPromise({
      provider,
      rpc: jsonrpc,
      types: {
        ContractsPsp34Id: {
          _enum: {
            U8: "u8",
            U16: "u16",
            U32: "u32",
            U64: "u64",
            U128: "u128",
            Bytes: "Vec<u8>",
          },
        },
      },
    });
    globalApi.on("connected", () => {
      globalApi.isReady.then((api) => {
        console.log(`Global RPC Connected: ${process.env.ALEPHZERO_PROVIDER_URL}`);
        global_vars.socketStatus = SOCKET_STATUS.CONNECTED;
      });
    });
    globalApi.on("ready", async () => {
      console.log("Global RPC Ready");
      global_vars.socketStatus = SOCKET_STATUS.READY;
    });
    globalApi.on("error", (err) => {
      console.log('error', err );
      global_vars.socketStatus = SOCKET_STATUS.ERROR;
    });
  } catch (e) {
    console.log(`API GLOBAL - ERROR: ${e.message}`);
  }

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      requestBodyParser: { json: { limit: '1MB' } },
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
        disabled: true
      },
      apiExplorer: {
        disabled: true,
      },
      cors: {
        origin: (process.env.CORS_ORIGIN) ? process.env.CORS_ORIGIN : '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
