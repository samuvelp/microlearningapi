const admin = require("firebase-admin");
const serviceAccount = require("/home/samuvel/Documents/apidev/microLearning/fb-admin.json");
const deviceToken = ''
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://micro-learning-2f309.firebaseio.com"
});
const payload = {
    data:{
        title : 'First message',
        body : 'Oh yheaaaaa!',
        url : 'www.google.com'
    }
}
const options = {
    priority: "high"
}
admin.messaging().sendToDevice(deviceToken,payload,options)
    .then((response)=>{
        console.log('Successfully sent notification',response)
    })
    .catch((error)=>{
        console.log('Failed to send notification',error)
    })