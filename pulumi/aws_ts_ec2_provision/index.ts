import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const amiSize = "t3.micro";

const ami = aws.ec2.getAmiOutput({
    mostRecent: true,
    owners: ["099720109477"],
    filters: [{
        name: "name",
        values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"],
    }]
});

const server = new aws.ec2.Instance("aws-demo-server", {
    instanceType: amiSize, 
    ami: ami.id,
    tags: {
        "Name": "DEV",
    }
});
