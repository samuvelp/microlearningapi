const admin = require("firebase-admin");
const serviceAccount = require("/home/samuvel/Documents/apidev/microLearning/fb-admin.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://micro-learning-2f309.firebaseio.com"
});


const sendNotification = (deviceToken, payloadData) => {
    const options = {
        priority: "high"
    }

    const payload = {
        data: {
            title: payloadData.title,
            body: payloadData.body,
            url: payloadData.url
        }
    }
    
    admin.messaging().sendToDevice(deviceToken, payload, options)
        .then((response) => {
            console.log('Successfully sent notification', response)
        })
        .catch((error) => {
            console.log('Failed to send notification', error)
        })
}
module.exports ={
    sendNotification
}