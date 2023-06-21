import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
}

const ses = new SESClient(awsConfig);


const createSendEmailCommand = (toAddress: string, fromAddress: string, message: string) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress]
    },
    Source: fromAddress,
    Message: {
      /* required */
        Subject: {
            Charset: "UTF-8",
            Data: "Your one time password",
        },       
      Body: {
        /* required */
        Html: {           
          Charset: "UTF-8",
          Data: message,
        },
      },
    },
  });
};

export const sendEmailToken = async (email: string, token: string) => {
    console.log(email, token);
  
    const message = `Your one time password is: ${token}`;
    const command = createSendEmailCommand(email, "this.me.gci@gmail.com", message);
    console.log(message)

  try {
    return await ses.send(command);
    console.log("email sent successfully");
  } catch (e) {
    console.log(e)
    console.error("Failed to send email.");
    
  }
};


