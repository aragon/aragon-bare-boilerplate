# Aragon Bare Boilerplate

Bare boilerplate for Aragon applications.

This boilerplate *only* includes the contract interfaces and `@aragon/client`, along with the two required application manifests: `manifest.json` and `module.json`.

This boilerplate is ideal for building applications that do not use React or Truffle.

## Usage

```sh
aragon-dev-cli init foo.aragonpm.test bare
```

## Prerequisites

- [**@aragon/cli**](https://github.com/aragon/aragon-dev-cli): Used to publish the application

## What's in the box?

### npm Scripts

- **None**

### Libraries

- [**@aragon/core**](https://github.com/aragon/aragon-core): Aragon interfaces
- [**@aragon/client**](https://github.com/aragon/aragon.js/tree/master/packages/aragon-client): Wrapper for Aragon application RPC
