const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const connection = {}

const dbConnect = async () => {

    if (connection.on) {
        return;
    }

    const db = await mongoose.connect('mongodb+srv://testUser3:eMV2Z5XYbL4X9VhJ@cluster0.ud7kb.mongodb.net/Third?retryWrites=true&w=majority', options);

    connection.on = db.connections[0].readyState;
}

module.exports = {
  dbConnect
};