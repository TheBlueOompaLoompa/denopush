// @deno-types="npm:@types/express"
import express from "npm:express";
import { create } from "https://deno.land/x/djwt@v3.0.1/mod.ts";
import { encodeBase64Url } from "https://deno.land/std@0.208.0/encoding/base64url.ts";
import { load } from "https://deno.land/std@0.212.0/dotenv/mod.ts";


const env = await load();

const app = express();

app.use(express.json());

let subscriptionData: any;
let jwt: any;
/*
app.get('/pubkey', (req, res) => {
	res.send(pub);
});

app.get('/send-notification', (req, res) => {
	if(subscriptionData) {
		console.log({ endpoint: subscriptionData.endpoint, key: subscriptionData.keys.p256dh, auth: subscriptionData.keys.auth })

		sendWebPushMessage(
			{
				data: JSON.stringify({
					title: 'hi',
					body: 'Hello, world!'
				}),
				sub: env.VAPID_MAILTO,
				ttl: '0',
				urgency: 'normal'
			}
		, { endpoint: subscriptionData.endpoint, key: subscriptionData.keys.p256dh, auth: subscriptionData.keys.auth }, keypair.privateKey)
		res.sendStatus(200);
	}else {
		res.sendStatus(500);
	}

})

app.post("/save-subscription", async (req, res) => {
	subscriptionData = req.body;
	console.log(subscriptionData);
	res.sendStatus(200);
});*/

app.use(express.static("./public"));

app.listen(8000);

const key = await crypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" },
  true,
  ["sign", "verify"],
);

const keypair = {
  publicKey: await crypto.subtle.exportKey("spki", key.publicKey),
  privateKey: await crypto.subtle.exportKey("jwk", key.privateKey),
};

console.log(encodeBase64Url(keypair.publicKey))

/*const serverKey = await crypto.subtle.exportKey("jwk", key.privateKey);
const serverKeyString = JSON.stringify(serverKey, null, 0);
const vapidKey = btoa(serverKeyString);
console.log(vapidKey)*/




/*
app.get('/pubkey', (req, res) => {
  res.send(encodeBase64Url(keypair.publicKey));
});

app.post("/save-subscription", async (req, res) => {
	subscriptionData = req.body;

  console.log(subscriptionData)

  //jwt = makeJWT(subscriptionData);

	console.log(subscriptionData);
	res.sendStatus(200);
});*/




async function makeJWT() {
  const jwt = await create({ alg: "ES256", typ: "JWT" }, {}, key.privateKey)

  return jwt;
}