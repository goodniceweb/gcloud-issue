# Issue with npm client for google-cloud/compute

## High level description

When I create a VM from nodejs code for my needs and want to define some disk
according to the [documentation](https://googleapis.dev/nodejs/compute/latest/Zone.html#createVM),
I can not use disks API. It always fails for me with the following error:

```
Invalid value for field 'resource.disks[1]': '{  "boot": true,  "initializeParams": {    "sourceImage": "https://www.googleapis.com/compute/v1/pro...'. Boot disk must be the first disk attached to the instance.'" } }'
```

That happens because of [this line](https://github.com/googleapis/nodejs-compute/blob/b6b72ee6ed8eaef1b68d206811ea7f2b62987cd6/src/zone.js#L656-L663).
The code always adds an object with the config

```
{
  boot: true,
  ...
}
```

## How to reproduce:

#### Step 0 (pre-requirements)

1. You have a project on google cloud.
2. You have a service key with enough permissions to do admin actions with VMs

#### Step 1

Make a clone of this repo and do

```
npm install
```

#### Step 2

Set local env variables for:
1. `GOOGLE_APPLICATION_CREDENTIALS`
1. `PROJECT_ID`

#### Step 3

```
npm run reproduce
```


