# Sample apps using Layer Web SDK

This repository contains sample chat applications that use version 1.0 of the Layer Web SDK to demonstrate how one would use the SDK to build a simple chat application using one of these three popular frameworks:

 - [Backbone](./backbone)
 - [Angular](./angular)
 - [React](./react)

Each sample app implementation is framework specific and not necessarily a demonstration of best practice.

![Screenshot](sample-screenshot.png)

## The Web SDK

The Web SDK in all samples is loaded via script tag directly from our [CDN](https://cdn.layer.com/sdk/1.0/layer-websdk.js). For more information on how the Web SDK works, see [Web SDK Docs](https://developer.layer.com/docs/websdk).

## Authentication

For demonstration purposes Layer provides a sample authentication endpoint which works for Layer **Staging Applications only**. It exposes a global `window.layerSample` utility and injects an initial HTML login dialog.

Layer Staging Application IDs can be found in your [Developer Dashboard](https://developer.layer.com/projects/keys).

> In real application this should be replaced with your own authentication mechanism and manage your own user identities.

## Sample Users

Sample Users should have been setup for you automatically.  If your app does NOT have users setup for you already, you will see an alert when running the application, and you can use the following commands to setup your app with the correct Identities.  You can find YOUR_APP_ID in the `Keys` section of the Developer Dashboard; you can find YOUR_TOKEN in the `Integration` section of the Developer Dashbaord.

```
curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 0", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/0.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/0/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 1", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/1.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/1/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 2", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/2.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/2/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 3", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/3.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/3/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 4", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/4.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/4/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"display_name": "User 5", "avatar_url": "https://s3.amazonaws.com/static.layer.com/sdk/sampleavatars/5.png"}' \
      https://api.layer.com/apps/YOUR_APP_ID/users/5/identity

curl  -X POST \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -d '{"distinct": false, "participants": ["0","1","2","3","4","5"]}' \
      https://api.layer.com/apps/YOUR_APP_ID/conversations
