const Compute = require('@google-cloud/compute')

const config = {
  os: 'ubuntu',
  projectId: process.env.PROJECT_ID,
  machineType: 'n1-highcpu-4',
  vmName: 'test-vm',
  zone: 'us-central1-c'
}

function getZone () {
  const compute = new Compute({
    projectId: config.projectId
  })
  return compute.zone(config.zone)
}

function getVm () {
  const zone = getZone()
  return zone.vm(config.vmName)
}

function getIp (metadata) {
  return metadata['networkInterfaces'][0]['accessConfig'][0]['natIp']
}

async function reproduce () {
  console.log('google credentials from env: ', process.env.GOOGLE_APPLICATION_CREDENTIALS)

  async function createVMWithStartupScript () {
    const vm = getVm()

    try {
      console.log(`Creating VM ${config.vmName}...`)
      const [, operation] = await vm.create({
        os: config.os,
        http: true,
        machineType: config.machineType,
        disks: [{
          // boot: true,
          autoDelete: true,
          initializeParams: {
            diskSizeGb: 50,
            sourceImage: 'https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images/ubuntu-2004-focal-v20201028'
          }
        }]
      })

      console.log(`Polling operation ${operation.id}...`)
      await operation.promise()
    } catch (err) {
      return console.error('something went wrong', err)
    }

    console.log('Acquiring VM metadata...')
    const [metadata] = await vm.getMetadata()

    const ip = getIp(metadata)
    console.log(`Booting new VM with IP http://${ip}...`)

    // Ping the VM to determine when the HTTP server is ready.
    console.log(`\n${vmName} created succesfully`)

    return ip
  }

  return await createVMWithStartupScript()
}

reproduce()
