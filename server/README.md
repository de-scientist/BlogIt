### **TypeScript, Express, Prisma, SQL Server Setup This guide walks you through setting up a simple Express and TypeScript development environment from scratch.**

#### **TypeScript with Express In this first part, let's set up TypeScript with Express**

- Start by creating the package.json file:

&nbsp; **npm init -y**

- Install **typescript** and **nodemon** and **ts-node** as development dependencies, **ts-node** is a package that allows us to execute typescript without having to compile it to JavaScript first

  **npm i nodemon typescript ts-node -D**

- Initialize typescript config:

  **npx tsc --init**

- Install Express **npm i express**
- Install express types as a development dependency:

**npm i @types/express -D**

- Add the following script in your **package.json** under scripts (assuming your entry point is a file called **index.ts** and is inside the src folder):

  **"scripts": { "start:dev": "nodemon src/index.ts" },**

- Here is our first express code in TypeScript

**//src/index.ts import express, { type Express, type Request, type Response } from "express";**

**const app: Express = express();**

**app.get("/", (\_req: Request, res: Response) => { res.send("Welcome to Express + TS"); });**

**const PORT = 3000; app.listen(PORT, () => { console.log(App running on port ${PORT}); });**

- Adding Prisma Now let's add prisma to our set up.

- Start by installing the prisma CLI as a dev dependency.

&nbsp; **npm i prisma -D**

- Initialize prisma in your project with sqlserver as the database: **npx prisma init --datasource-provider sqlserver**
- Install **dotenv**, and add import "dotenv/config"; to your **prisma.config.ts** file to load environment variables from .env. **npm i dotenv**
- Inside prisma.config.ts, add the line: **import "dotenv/config";**

- Create your models in prisma/schema.prisma,

example:

&nbsp; **model User { id String @id @default(uuid()) firstName String lastName String @@map("Users") }**

- Before running migrations, update the generate part of your schema.prisma from:

**generator client { provider = "prisma-client" output = "../src/generated/prisma" }**

**to:**

**generator client { provider = "prisma-client-js" }**

- Update DATABASE_URL in .env with the correct details and run migrations; **npx prisma** **migrate dev --name initial_migration**
- Install prisma client package npm i @prisma/client
- At one point, you might need to add the following two lines in **tsconfig.json** under **compilerOptions** when you get the error
- An import path can only end with a '.ts' extension when **'allowImportingTsExtensions' is enabled. "allowImportingTsExtensions": true, "noEmit": true**
