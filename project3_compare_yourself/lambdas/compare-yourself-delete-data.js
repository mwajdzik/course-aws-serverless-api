const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB({region: 'us-west-2', apiVersion: '2012-08-10'});

module.exports.handler = (event, context, callback) => {
    const params = {
        TableName: 'CompareYourself',
        Key: {
            UserId: {
                S: event.userId
            }
        }
    }

    dynamoDb.deleteItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
            callback(err);
        } else {
            callback(null, data);
        }
    });
}
