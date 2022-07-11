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

## Body Mapping Templates

simply allow to control which data your action receives (e.g. Lambda)

```json
{
  "person": {
    "height": 180,
    "age": 28,
    "income": 5000
  },
  "order": {
    "id": "6asdf821ssa"
  }
}
```

to

```json
{
  "personName": "Max",
  "orderId": "6asdf821ssa"
}
```

using:

```json
{
  "personName": "$input.json('$.person.name')",
  "orderId": "$input.json('$.order.id')"
}
```

## AWS SDK

[https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html)

[https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)

[https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_dynamodb_code_examples.html](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_dynamodb_code_examples.html)

## DynamoDB

A primary key defines an item attribute with unique values.
It's either just one attribute (partition key) or two attributes (partition + sort key).
