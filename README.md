# Crypto Signals

This page sends you a notification whenever a price of a crypto reaches the threshold you desire. It uses a scheduled function that checks every minute if any alert has been triggered and sends you the notification via websockets.

## Functionalities

- User can perform a CRUD on Buy/Sell Alerts (Personal)
- Alerts have the following attributes:
  - Type: Buy/Sell
  - Target Price: Number
  - Tolerance(%): Error that user is willing to accept for the alert to trigger.
  - Active: True/False (Indicates if alert has been triggered)

## Extra

- Frontend was developed using Nextjs

## Screenshots

### Login

### Alert CRUD

### Websocket notification
