# Quickstart
This contains a script to show how to build a custom Admin platform on Sportstalk 24/7

### How to use
1. Create a `.env` file with the required API keys. You can see the required settings in `.env_example`
2. Use `npm install` and then `npm start`.

## Core concepts
Sportstalk 24/7 has two APIs, the standard "application" api and a "management" API reserved only for customers who want to build a custom administration experience. 
For instance, if a customer wishes to build their own platform or white-labeled experience using Sportstalk 24/7's chat technology to provide a seamless experience.

You can see the basics of:
1. Creating an "application" - a set of rooms and topics for chat, either with its own user DB or using a global DB.
2. Creating access tokens for each application, with token-level permissions
3. Creating your first users for that application and assigning 'admin', 'moderator', or standard user roles.

Customers who want to utilize these capabilities should contact Sportstalk 24/7 sales.  These capabilities are usually limited only to customers who user a standalone instance of Sportstalk 24/7.

