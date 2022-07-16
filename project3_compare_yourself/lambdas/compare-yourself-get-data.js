const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB({region: 'us-west-2', apiVersion: '2012-08-10'});
const cisp = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

module.exports.handler = (event, context, callback) => {
    const type = event.type;
    const accessToken = event.accessToken;

    if (type === 'all') {
        const params = {
            TableName: 'CompareYourself'
        }

        dynamoDb.scan(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                callback(err);
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
        const cispParams = {"AccessToken": accessToken};

        cisp.getUser(cispParams, (err, result) => {
            if (err) {
                console.log(err);
                callback(err);
            }

            const userId = result.UserAttributes[0].Value;

            const params = {
                TableName: 'CompareYourself',
                Key: {
                    UserId: {
                        S: userId
                    }
                }
            }

            dynamoDb.getItem(params, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    callback(err);
                } else {
                    const item = {
                        age: +data.Item.Age.N,
                        height: +data.Item.Height.N,
                        income: +data.Item.Income.N,
                    };

                    callback(null, item);
                }
            });
        });
    } else {
        callback('invalid type');
    }
}
