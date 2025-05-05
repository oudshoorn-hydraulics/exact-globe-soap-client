# Typescript / Javascript Exact Globe soap client

Simple wrapper for soap client which enables it to connect to the Exact entity services via the soap interface.

## Installation:

This package is hosted on GitHub, to install it, create a .npmrc with the custom GitHub namespace:

```
registry=https://registry.npmjs.org
@mvdve:registry=https://npm.pkg.github.com
```

Then run:
```
npm install @mvdve/mssql-query-builder
```

## Examples:

```typescript
import * as soap from "ts-exact-soap-client";
import axios from "axios";

const soapConfig: soap.Config = {
    soapHost: "http://192.168.1.1:8010",
    dbHost: "SERVER_NAME\\host_name",
    dbName: "database_name",
    domain: "domain_name",
    password: "password",
    userId: "username"
}
try {
    // Depending on the mode, the correct WSDL file is loaded.
    const client = await soap.createClient("single", soapConfig);
    
    // Send order line
    const linePropertyData: soap.InputPropertyData[] = [];
    linePropertyData.push({name: "ItemCode", value: "product-sku"});
    linePropertyData.push({name: "Quantity", value: 10});

    // Use transaction key when creating an entity, add this key to all the following requests.
    const transactionKey = await soap.create(client, "SalesOrderLine", linePropertyData);
    
    // Load product
    const product = await retrieve(client, "Item", [{name: "ItemCode", value: "itemcode"}]);
} catch (err) {
    // Extract errors from Entity services response
    if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
            // Access denied.
        }
        
        if (err.response.data) {
            const message = soap.extractErrorMessage(String(err.response.data));
            // Use error message   
        }
    }   
}
```
