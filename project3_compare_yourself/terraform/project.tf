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

# ---

resource "aws_iam_role" "lambda_role" {
  name               = "Spacelift_Test_Lambda_Function_Role"
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

resource "aws_iam_policy" "iam_policy_for_lambda" {
  name        = "aws_iam_policy_for_terraform_aws_lambda_role"
  path        = "/"
  description = "AWS IAM Policy for managing aws lambda role"
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
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.iam_policy_for_lambda.arn
}

data "archive_file" "zip_the_python_code" {
  type        = "zip"
  source_dir  = "${path.module}/../python/"
  output_path = "${path.module}/../python/hello-python.zip"
}

resource "aws_lambda_function" "terraform_lambda_func" {
  function_name = "Spacelift_Test_Lambda_Function"
  filename      = "${path.module}/../python/hello-python.zip"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.lambda_handler"
  runtime       = "python3.8"
  depends_on    = [
    aws_iam_role_policy_attachment.attach_iam_policy_to_iam_role
  ]
}
