module.exports.handler = (event, context, callback) => {
    const error = null;

    callback(error, {"age": (event.age + event.height) / 2});
}
