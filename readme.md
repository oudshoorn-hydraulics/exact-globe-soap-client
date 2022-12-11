# Typescript Exact Globe soap client

Simple wrapper for soap client which enables it to connect to the Exact entity services via the soap interface.

## Dependency issues

- axios-ntlm fixed to 1.3.0, otherwise node_modules/axios-ntlm/node_modules/axios gets updated to 1.2.1.
- Use dev branche of node-soap, the current version (0.45.0) has type issues when using modules.