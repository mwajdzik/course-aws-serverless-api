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
}

resource "aws_api_gateway_resource" "resource_1" {
  path_part   = "my-path"
  parent_id   = aws_api_gateway_rest_api.rest_api_test.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.rest_api_test.id
}

resource "aws_api_gateway_method" "resource_1_get_1" {
  authorization = "NONE"
  http_method   = "GET"
  resource_id   = aws_api_gateway_resource.resource_1.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api_test.id
}

resource "aws_api_gateway_integration" "resource_1_get_1_integration" {
  rest_api_id       = aws_api_gateway_rest_api.rest_api_test.id
  resource_id       = aws_api_gateway_resource.resource_1.id
  http_method       = aws_api_gateway_method.resource_1_get_1.http_method
  type              = "MOCK"
  request_templates = {
    "application/json" : "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "response_200" {
  rest_api_id = aws_api_gateway_rest_api.rest_api_test.id
  resource_id = aws_api_gateway_resource.resource_1.id
  http_method = aws_api_gateway_method.resource_1_get_1.http_method
  status_code = 200
}

resource "aws_api_gateway_integration_response" "resource_1_get_1_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.rest_api_test.id
  resource_id = aws_api_gateway_resource.resource_1.id
  http_method = aws_api_gateway_method.resource_1_get_1.http_method
  status_code = aws_api_gateway_method_response.response_200.status_code

  response_templates = {
    "application/json" : "{\"message\": \"OK\"}"
  }
}

resource "aws_api_gateway_deployment" "resource_1_get_1_integration_deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api_test.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.resource_1.id,
      aws_api_gateway_method.resource_1_get_1.id,
      aws_api_gateway_integration.resource_1_get_1_integration.id,
    ]))
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
