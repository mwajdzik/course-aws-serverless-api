provider "aws" {
  version = "~> 3.0"
  region  = "us-west-2"
  profile = "default"
}

data "aws_caller_identity" "current" {
}

data "aws_region" "current" {}

# ---

resource "aws_api_gateway_rest_api" "compare_yourself" {
  name        = "compare-yourself"
  description = "Allows users to compare themselves"
  body        = data.template_file.swagger_api.rendered
}

data "template_file" "swagger_api" {
  template = file("./swagger.json")
  vars     = {
    compare_yourself_store_data : aws_lambda_function.compare_yourself_store_data.arn
  }
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

# ---

resource "aws_iam_role" "compare_yourself_lambda_role" {
  name               = "compare_yourself_lambda_role"
  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "lambda.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}

resource "aws_iam_policy" "iam_policy_for_compare_yourself_lambda" {
  name        = "aws_iam_policy_for_compare_yourself_lambda_role"
  description = "AWS IAM Policy for managing AWS lambda role"
  path        = "/"
  policy      = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": [
       "logs:CreateLogGroup",
       "logs:CreateLogStream",
       "logs:PutLogEvents"
     ],
     "Resource": "arn:aws:logs:*:*:*",
     "Effect": "Allow"
   }
 ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
  role       = aws_iam_role.compare_yourself_lambda_role.name
  policy_arn = aws_iam_policy.iam_policy_for_compare_yourself_lambda.arn
}

data "archive_file" "zip_code" {
  type        = "zip"
  source_dir  = "${path.module}/../src/"
  output_path = "${path.module}/../src/compare-yourself.zip"
}

resource "aws_lambda_function" "compare_yourself_store_data" {
  function_name = "compare-yourself-store-data"
  description   = "Compare Yourself: store data"
  filename      = "${path.module}/../src/compare-yourself.zip"
  handler       = "compare-yourself-store-data.handler"
  runtime       = "nodejs12.x"
  role          = aws_iam_role.compare_yourself_lambda_role.arn
  depends_on    = [
    aws_iam_role_policy_attachment.attach_iam_policy_to_iam_role
  ]
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromApiGateway"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = aws_lambda_function.compare_yourself_store_data.function_name
  source_arn    = "arn:aws:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*/*/*/*"
}

# ---
