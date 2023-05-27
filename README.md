## Local Development Environment

## Prequisites

- [NodeJS](https://nodejs.org/en)
- [PNPM](https://pnpm.io/) OR [YARN](https://yarnpkg.com/) OR [NPM]()

## Info

- Open the project and run one of the following commands from the terminal:

  - pnpm i - if you are using pnpm
  - yarn install - if you are using yarn
  - npm i - if you are using npm

- After all dependencies have been installed, open 2 terminals and run the followings commands:
  - **in the first termianl PORT=3000 RECEIVER_PORT=3001 pnpm ts-node ./src/index.ts** - this will initiate the first session
  - **in the second termianl PORT=3001 RECEIVER_PORT=3000 pnpm ts-node ./src/index.ts** - this will initiate the second session

## Available commands :

- After the sessions have been instantiated, you'll be able to run the following commands from the terminal:
  - help - will print the available commands that you can use
  - balance - will print you current account balance
  - pay <amount> - you'll send the <amount> value to the other peer (**Example pay 10 will send 10$ to the 2nd peer**)
  - exit - will end your session
