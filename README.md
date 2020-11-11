# Issue with npm client for google-cloud/compute

## Expected behavior

When I initialize a VM with one or more disks, following [official documentation example](https://googleapis.dev/nodejs/compute/latest/Zone.html#createVM-examples)
it creates for me specified disks as configured.

## Actual behavior

As soon as `disks` config is not empty array, it always fails with one of following errors:

### Error 1:

```
Invalid value for field 'resource.disks[0]':
  '{  "initializeParams": {
      "sourceImage": "https://www.googleapis.com/compute/v1/projects/ubuntu-os...'.
Boot disk must be the first disk attached to the instance.``'" } }'
```

### Error 2:

```
Invalid value for field 'resource.disks[1]':
  '{  "boot": true, 
      "initializeParams": {
        "sourceImage": "https://www.googleapis.com/compute/v1/pro...'.
Boot disk must be the first disk attached to the instance.'" } }'
```

## High level description

That happens because of [this line](https://github.com/googleapis/nodejs-compute/blob/b6b72ee6ed8eaef1b68d206811ea7f2b62987cd6/src/zone.js#L656-L663).
The code always adds an object with the config to the last position of the `disks` config array. For the VM is important to have a proper config.
If I add a bootable disk, then it fails with Error 1. If I add a not bootable disk - it fails with Error 2.

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

Run `reproduce` command with the following env variables set:

1. `GOOGLE_APPLICATION_CREDENTIALS` - path to a file which authorize gcloud api requests
2. `PROJECT_ID` - an id of your project in google cloud

```
GOOGLE_APPLICATION_CREDENTIALS=/path/to/file PROJECT_ID=project-id npm run reproduce
```


