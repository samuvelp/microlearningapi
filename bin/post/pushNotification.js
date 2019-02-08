const admin = require("firebase-admin");
const serviceAccount = require("/home/samuvel/Documents/apidev/microLearning/fb-admin.json");
const deviceToken = 'ffmllcu7MWM:APA91bFANTR4GyOTlTLED7ApvCLdBL5D_DKDysfsuRvvAzBeIMxAHVj_-UufvM2p4I5pe9Yj9tBP65nLk1w3b8nqTnTy73wZwdK7ITqdKN75ZQ3Umj9vFsOY_liWl1uwoNfKXp_2jKjy'
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