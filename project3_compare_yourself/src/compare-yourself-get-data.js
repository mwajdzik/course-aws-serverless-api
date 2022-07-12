const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB({region: 'us-west-2', apiVersion: '2012-08-10'});

module.exports.handler = (event, context, callback) => {
    const error = null;
    const type = event.type;

    if (type === 'all') {
        const params = {
            TableName: 'CompareYourself'
        }

        dynamoDb.scan(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                callback(error);
            } else {
                const items = data.Items.map((i) => {
                    return {
                        age: +i.Age.N,
                        height: +i.Height.N,
                        income: +i.Income.N,
                    };
                });
                callback(null, items);
            }
        });
    } else if (type === 'single') {
        const params = {
            TableName: 'CompareYourself',
            Key: {
                UserId: {
                    S: 'user-0.7933751882582918'
                }
            }
        }

        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                callback(error);
            } else {
                const item = {
                    age: +data.Item.Age.N,
                    height: +data.Item.Height.N,
                    income: +data.Item.Income.N,
                };

                callback(null, item);
            }
        });
    } else {
        callback('invalid type');
    }
}
