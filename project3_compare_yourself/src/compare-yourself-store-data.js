module.exports.handler = (event, context, callback) => {
    const error = null;

    callback(error, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Hello, World!!!',
        }),
    });
}
