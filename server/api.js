const app = require('express')();
const bodyParser = require('body-parser');
const { setQueues, UI } = require('bull-board')
const swaggerUi = require('swagger-ui-express');

const swaggerDoc = require('./swaggerDoc');
const {produce, queues} = require('./producer');

const {PORT} = process.env;

// queues visualization dashboard
setQueues(Object.values(queues));
app.use('/queues', UI)

// serve swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(bodyParser.json());

app.post('/notification', async (req, res) => {
    const notification = req.body;
    try {
        const job = await produce(notification);
        return res.json({id: job.id});
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).send({type: 'ValidationError', error});
        } else {
            console.log(error);
            return res
                .status(500)
                .send({
                    type: 'InternalServerError',
                    error: {message: 'internal server error'},
                });
        }
    }
});

app.listen(PORT, () =>
    console.log(`Server started`)
);

module.exports = app;
