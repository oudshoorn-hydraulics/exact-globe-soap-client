# Why WSDL files as strings

JavaScript libraries can be used in alot of different ways. As ESM or CJS packages, bundled, or just imported.
The External WSDL files cause a lot of issues with bundlers, so we use them as strings to avoid these issues.
