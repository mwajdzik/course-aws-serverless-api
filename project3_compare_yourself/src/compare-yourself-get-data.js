module.exports.handler = (event, context, callback) => {
    const error = null;
    const type = event.type;

    if (type === 'all') {
        callback(error, 'get all');
    } else if (type === 'single') {
        callback(error, 'get single');
    } else {
        callback('invalid type', '');
    }
}
