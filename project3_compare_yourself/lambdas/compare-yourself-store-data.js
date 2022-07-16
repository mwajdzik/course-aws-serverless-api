const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB({region: 'us-west-2', apiVersion: '2012-08-10'});

module.exports.handler = (event, context, callback) => {
    const params = {
        TableName: "CompareYourself",
        Item: {
            UserId: {
                S: `${event.userId}`
            },
            Age: {
                N: `${event.age}`
            },
            Height: {
                N: `${event.height}`
            },
            Income: {
                N: `${event.income}`
            }
        },
    };

    dynamoDb.putItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
            callback(err);
        } else {
            callback(null, data);
        }
    });
}
