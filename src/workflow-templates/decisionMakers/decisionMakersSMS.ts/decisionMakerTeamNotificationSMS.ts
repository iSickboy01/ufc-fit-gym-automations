export const decisonMakersNotificationSMS = (name: string, phoneNumber: string = "(488)-435-9067", emailAddress: string = "doctorsimpsonswag@gmail.com",
    fullAddress: string = "UFCFit Oakridge Mall 5540 Winfield Ave #1000 San Jose, CA"
    ) => { 
        return ` ${name} just signed up for the 5 Day Free Pass! Reach out to them as soon as possible.

Here are their details:

${name}
${emailAddress}
${phoneNumber}
${fullAddress}`;
};

export default decisonMakersNotificationSMS;