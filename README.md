# Cryptoticker

Experimental cryptocurrency market data tracking application.

## Development

This application was bootstrapped using the create-react-app utility and subsequently ejected to allow further customization. The [react-easy-state](https://github.com/solkimicreb/react-easy-state) library is being used to handle local and global state management.

## Getting Started

`yarn install`

`yarn start`

## Data

There are two websocket services setup - Gemini and Cryptocompare. Both of which are abstracted in the `/Services` directory.

Two toggle between them as data sources, simply comment/uncomment the `subscribeTo` and `unsubscribe` import statements at the top of the `App.js` module.

```
import { subscribeTo, unsubscribe } from './Services/cryptocompareService';
// import { subscribeTo, unsubscribe } from './Services/geminiService';
```
