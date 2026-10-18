import { vendorServer } from '/vendor/src/server.ts';
const server=vendorServer(process.env.VENDOR_VERSION);server.listen(4101,'0.0.0.0');
