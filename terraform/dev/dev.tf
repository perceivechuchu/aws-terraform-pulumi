provider "aws" {
    profile = "default"
    region  = "af-south-1"
}

resource "aws_instance" "dev-server" {
    ami           = "ami-030b8d2037063bab3"
    instance_type = "t3.micro"
    tags = {
        Name = "DEV"
    }
}