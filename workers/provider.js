module.exports = {
    send(data) {
        console.log(data);
        return Promise.resolve(data);
    },
};
