# course-aws-serverless-api

## Services

- SPA - S3
- API - API Gateway - allows to define API endpoints & HTTP methods, authorize access
- Logic - Lambdas
- Data - DynamoDB
- Auth - Cognito
- DNS - Route53
- Cache - CloudFront

## Endpoint

- path and method
- cycle:
  - method request - how the request should look like (schema, params validation), authorization (possibly rejected)
  - integration request - what handles the request (mock, lambda, redirect)?
  - integration response - modify response 
  - method response - defines shape of the response (e.g. headers)
