const QuickPhonePe = require('./index');

const phonepe = new QuickPhonePe({ merchantId: "PGTESTPAYUAT86", saltKey: "96434309-7796-489d-8924-ab56988a6076", mode: "DEV" });

const getData = () => {

    phonepe.createTransaction({
        merchantTransactionId: "345345345sfdsf345435",
        amount: 10000,
        merchantUserId: '2312312323',
        redirectUrl: "http://localhost:3000/success",
        redirectMode: "REDIRECT",
        mobileNumber: "9999999999",
        paymentInstrument: {
            type: "PAY_PAGE",
        },
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}

const verifyTransaction = async () => {
    const response = await phonepe.verifyTransaction("345345345sfdsf345435");
    console.log(response.data);
}

verifyTransaction();