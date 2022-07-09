provider "aws" {
  version = "~> 3.0"
  region  = "us-west-2"
  profile = "default"
}

data "aws_caller_identity" "current" {
}

# ---

resource "aws_api_gateway_rest_api" "compare_yourself" {
  name        = "compare-yourself"
  description = "Allows users to compare themselves"
  body        = data.template_file.swagger_api.rendered
}

data "template_file" "swagger_api" {
  template = file("./swagger.json")
}

resource "aws_api_gateway_deployment" "compare_yourself_deployment" {
  rest_api_id = aws_api_gateway_rest_api.compare_yourself.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.compare_yourself.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "rest_api_test_stage" {
  rest_api_id   = aws_api_gateway_rest_api.compare_yourself.id
  deployment_id = aws_api_gateway_deployment.compare_yourself_deployment.id
  stage_name    = "dev"
}
