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

## CORS

Cross-origin resource sharing (CORS) is a browser security feature that restricts cross-origin HTTP requests that are
initiated from scripts running in the browser. If your REST API's resources receive non-simple cross-origin HTTP
requests, you need to enable CORS support.

[check](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)

