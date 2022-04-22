import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Create a network
const network = new gcp.compute.Network("network");

// Create a Virtual Machine Instance
const computeInstance = new gcp.compute.Instance("instance", {
    machineType: "f1-micro",
    zone: "us-central1-a",
    bootDisk: { initializeParams: { image: "debian-cloud/debian-9" } },
    networkInterfaces: [{
        network: network.id,
        accessConfigs: [{}],
    }],
});
