# wordsofweb3-verax

This repo is a WIP.

## Goals

1. Set up an attestation schema on Verax, on the Linea network, that allows for the general public to provide feedback and comments to the [wordsofweb3](https://wordsofweb3.eth.limo) glossary.
2. Extrapolate, based on what is built / learned in the process, to create a general-purpose / modifiable project which allows for the creation of user feedback forms embeddable in docs or other public-facing websites.

## Why

Briefly: Because if you've ever tried to configure a feedback form on a website, and then maintain it, you'll know that it's truly awful, opens you to spam, DDoS attacks, actually requires a significant amount of technical overhead (databases, auth management, etc.), and generally isn't good UX or DevEx.

This is a Boring Use Case that Blockchain Solves For: the chain is the database. L2s are getting cheap enough, and embedded wallets can allow for a low enough friction UX, for this to be actually workable.

## Current status, Jan 2025

- The attestation schema deployment setup _works_, and has successfully deployed a schema to Verax on Linea Sepolia Testnet.
- Currently trying to implement Sign In With Ethereum as the "wallet onboarder", that is, the thing that the user clicks on to `Connect wallet` and then submit an attestation.
