# Typescript Exact Globe soap client

Simple wrapper for soap client which enables it to connect to the Exact entity services via the soap interface.

## Dependency issues

- axios-ntlm fixed to 1.3.0, otherwise node_modules/axios-ntlm/node_modules/axios gets updated to 1.2.1.
- Use dev branche of node-soap, the current version (0.45.0) has type issues when using modules.

## Example: Send sales order line

    import * as soap from "ts-exact-soap-client";

    const soapConfig: soap.Config = {
        soapHost: "http://192.168.1.1:8010",
        dbHost: "SERVER_NAME\\host_name",
        dbName: "database_name",
        domain: "domain_name,
        password: "password",
        userId: "username"
    }

    // Depending on the mode, the correct WSDL file is loaded.
    const client = await soap.createClient("single", soapConfig);

    let transactionKey = "";
    let linePropertyData: soap.InputPropertyData[] = [];
    linePropertyData.push({name: "ItemCode", value: "product-sku"});
    linePropertyData.push({name: "Quantity", value: 10});

    transactionKey = await soap.create(client, "SalesOrderLine", linePropertyData);
    // Use transaction key for next line and header.