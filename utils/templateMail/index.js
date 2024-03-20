const Mailgen = require('mailgen');

const mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
        name: 'Ecommerce',
        link: 'ecommerce.website.com'
    }
});

module.exports = mailGenerator;