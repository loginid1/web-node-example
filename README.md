# Web Node Example

This serves as a practical demonstration of implementing passwordless authentication using LoginID's Web SDK. Designed for compatibility with web browsers, this SDK operates at a lower level, demanding more effort to set up passwordless flows. However, it offers increased flexibility and control. It is advisable to utilize this SDK only if you intend to establish a custom, predefined passwordless flow with LoginID's service.

This example demonstrates how to enforce email verification while optionally including a passkey for a new user. Passkeys will serve as the primary sign-in method, and in the event of any issues, the system will revert to email verification.

## Requirements

- [NodeJS](https://nodejs.org/en/download/)
- npm (included with NodeJS)
- [Docker](https://docs.docker.com/get-docker/) (optional)

## Features

- Passkeys
- Email Verification (Magic Links)

## Setup

Acquire a tenant `base URL` and `application ID` by creating a new [tenant](https://docs.loginid.io/Guides/Creating%20a%20New%20Tenant). The default website URL is set to `http://localhost:3000`. If you wish to modify the port, you can specify the website URL as `http://localhost:<PORT>`.

### .env

Generate a `.env` file and place it at the root of the example. Alternatively, you can utilize the provided `example.env` file by renaming it to `.env`. Ensure that it is populated with the relevant variables.

`PORT` is optional and will default to `3000` if not provided.

```
LOGINID_APP_ID=<APPLICATION_ID>
LOGINID_BASE_URL=<TENANT_BASE_URL>
PORT=<PORT>
```

## How to Run

The following commands will install the dependencies and run the example in dev mode.

```
npm install
npm run dev
```

## How to Run With Docker

The following commands will build the example image and run it with Docker.

```
docker build -t web-example .
docker run -p 3000:3000 web-example
```
