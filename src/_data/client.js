module.exports = {
    name: "Neon Flow Web Designs",
    email: "hello@neonflow.org",
    phoneForTel: "+447754970564",
    phoneFormatted: "+44 7754 970 564",
    address: {
        lineOne: "Neon Flow",
        lineTwo: "Headquarters",
        city: "Darlington",
        state: "Durham",
        zip: "DL1",
        country: "UK",
        mapLink: "https://maps.app.goo.gl/3DJ99n3JC93p5a5m7",
    },
    socials: {
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/",
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    domain: "https://www.neonflow.org",
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
