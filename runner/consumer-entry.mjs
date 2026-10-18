import { consumerServer } from '/app/src/server/server.ts';
const server=consumerServer(process.env.VENDOR_URL,process.env.SOURCE_ID,'isolated-verifier','/app/runtime-assets/app.js');server.listen(4102,'0.0.0.0');
