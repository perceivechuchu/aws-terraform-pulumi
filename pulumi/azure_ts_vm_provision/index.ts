import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure";

const config = new pulumi.Config();
const prefix = config.get("prefix") || "tfvmex";
const mainResourceGroup = new azure.core.ResourceGroup("mainResourceGroup", {location: "West US"});
const mainVirtualNetwork = new azure.network.VirtualNetwork("mainVirtualNetwork", {
    addressSpaces: ["10.0.0.0/16"],
    location: mainResourceGroup.location,
    resourceGroupName: mainResourceGroup.name,
});
const internal = new azure.network.Subnet("internal", {
    resourceGroupName: mainResourceGroup.name,
    virtualNetworkName: mainVirtualNetwork.name,
    addressPrefixes: ["10.0.2.0/24"],
});
const mainNetworkInterface = new azure.network.NetworkInterface("mainNetworkInterface", {
    location: mainResourceGroup.location,
    resourceGroupName: mainResourceGroup.name,
    ipConfigurations: [{
        name: "testconfiguration1",
        subnetId: internal.id,
        privateIpAddressAllocation: "Dynamic",
    }],
});
const mainVirtualMachine = new azure.compute.VirtualMachine("mainVirtualMachine", {
    location: mainResourceGroup.location,
    resourceGroupName: mainResourceGroup.name,
    networkInterfaceIds: [mainNetworkInterface.id],
    vmSize: "Standard_DS1_v2",
    storageImageReference: {
        publisher: "Canonical",
        offer: "UbuntuServer",
        sku: "16.04-LTS",
        version: "latest",
    },
    storageOsDisk: {
        name: "myosdisk1",
        caching: "ReadWrite",
        createOption: "FromImage",
        managedDiskType: "Standard_LRS",
    },
    osProfile: {
        computerName: "hostname",
        adminUsername: "testadmin",
        adminPassword: "Password1234!",
    },
    osProfileLinuxConfig: {
        disablePasswordAuthentication: false,
    },
    tags: {
        environment: "staging",
    },
});