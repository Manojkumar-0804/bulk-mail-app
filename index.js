import express, { json } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(json());

mongoose.connect("mongodb+srv://manoj:1234@cluster0.05lsg3g.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
).then(function () {
    console.log("Connected to DB")
}).catch(function () { console.log("Failed to connect") })

const credential = mongoose.model("credential", {}, "bulkmail")


app.post("/sendemail", function (req, res) {

    var msg = req.body.msg;
    var emailList = req.body.emailList;

    credential.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        new Promise(async function (resolve, reject) {
            try {

                for (var i = 0; i < emailList.length; i++) {

                    await transporter.sendMail({

                        from: "manojmk0804@gmail.com",
                        to: emailList[i],
                        subject: "A message from Bulk Mail App",
                        text: msg
                    }
                    )
                    console.log("Email sent to " + emailList[i]);
                }
                resolve("Success");
            }
            catch (error) {
                reject("Failed");
            }

        }).then(function () {
            res.send(true);
        }).catch(function () {
            res.send(false);
        })


    }).catch(function (error) {
        console.log(error)
    })

})

app.listen(5000, function () {
    console.log("Server Started......")
})