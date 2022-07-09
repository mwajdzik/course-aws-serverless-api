provider "aws" {
  version = "~> 3.0"
  region  = "us-west-2"
  profile = "default"
}

data "aws_caller_identity" "current" {
}

# ---

resource "aws_api_gateway_rest_api" "rest_api_test" {
  name        = "rest-api-test"
  description = "This is my API for demonstration purposes"
  body        = data.template_file.sample_api_swagger.rendered
}

data "template_file" "sample_api_swagger" {
  template = file("./swagger.json")
}

resource "aws_api_gateway_deployment" "resource_1_get_1_integration_deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api_test.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.rest_api_test.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "rest_api_test_stage" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api_test.id
  deployment_id = aws_api_gateway_deployment.resource_1_get_1_integration_deployment.id
  stage_name    = "dev"
}
