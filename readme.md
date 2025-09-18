# Typescript / Javascript Exact Globe soap client

Simple wrapper for soap client which enables it to connect to the Exact entity services via the soap interface.

## Installation:

This package is hosted on GitHub, to install it, create a .npmrc with the custom GitHub namespace:

```
registry=https://registry.npmjs.org
@oudshoorn-hydraulics:registry=https://npm.pkg.github.com
```

Then run:
```
npm install @oudshoorn-hydraulics/exact-globe-soap-client
```

## Examples:

```typescript
import {soap} from "@oudshoorn-hydraulics/exact-globe-soap-client";
import axios from "axios";

const soapConfig: soap.Config = {
    soapHost: "http://192.168.1.1:8010",
    dbHost: "SERVER_NAME\\host_name",
    dbName: "database_name",
    domain: "domain_name",
    password: "password",
    userId: "username"
}

// Depending on the mode, the correct WSDL file is loaded.
const client = await soap.createClient("single", soapConfig);
if (!client.success) {
    // handle error from ExactResult, available variables:
    //
    // error: string;
    // exactError?: string;
    // statusCode?: number;
    // exception?: unknown;
}

// Send order line
const linePropertyData: soap.InputPropertyData[] = [];
linePropertyData.push({name: "ItemCode", value: "product-sku"});
linePropertyData.push({name: "Quantity", value: 10});

const result = await soap.create(client.data, "SalesOrderLine", linePropertyData);
if (!result.success) {
    // handle error.
}

// Use the transaction key for the next order line or header.
const transactionKey = result.data;

// Load product
const result = await retrieve(client.data, "Item", [{name: "ItemCode", value: "itemcode"}]);
if (!result.success) {
    // handle error.
}
```
