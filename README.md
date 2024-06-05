 
 
## Overview

The QuickPhonePe library provides an easy interface to integrate with the PhonePe payment gateway. It allows you to create and verify transactions using the PhonePe API.

## Installation

To install the QuickPhonePe library, use npm:

```sh
npm install quick-phonepe
```

## Usage

Here's a step-by-step guide on how to use the QuickPhonePe library in your Node.js project.

### Import the QuickPhonePe Class

First, import the QuickPhonePe class in your project:

```javascript
const QuickPhonePe = require('quick-phonepe');
```

### Initialize the QuickPhonePe Instance

Create an instance of the QuickPhonePe class with your configuration details:

```javascript
const phonePe = new QuickPhonePe({
    merchantId: 'YOUR_MERCHANT_ID',
    saltKey: 'YOUR_SALT_KEY',
    keyIndex: 1, // default is 1
    mode: 'DEV' // or 'PROD' for production
});
```

### Create a Transaction

To create a transaction, you need to provide the transaction data. The `createTransaction` method returns a promise with the response from the PhonePe API.

```javascript
const transactionData = {
    merchantTransactionId: 'txn_001',
    merchantUserId: 'user_001',
    name: 'John Doe',
    amount: 10000, // amount in paisa (1 INR = 100 paisa)
    redirectUrl: 'https://yourwebsite.com/callback',
    redirectMode: 'REDIRECT',
    mobileNumber: '1234567890',
    paymentInstrument: {
        type: 'PAY_PAGE'
    }
};

const response = await phonePe.createTransaction(transactionData);
console.log(response);

```

### Verify a Transaction

To verify the status of a transaction, use the `verifyTransaction` method with the merchant transaction ID.

```javascript
const merchantTransactionId = 'txn_001';

const response = await phonePe.verifyTransaction(merchantTransactionId);
console.log(response);

```

## API Reference

### QuickPhonePe

#### Constructor

```javascript
new QuickPhonePe(config)
```

- **config**: An object containing the following properties:
  - `merchantId` (string): The Merchant ID provided by PhonePe.
  - `saltKey` (string): The Salt Key provided by PhonePe for hashing.
  - `keyIndex` (number, optional): The Key Index for the salt key. Default is 1.
  - `mode` (string, optional): The mode of the API, either 'DEV' for sandbox or 'PROD' for production. Default is 'DEV'.

#### Methods

##### createTransaction(data)

Creates a transaction using the PhonePe payment gateway.

- **data**: An object containing the transaction data:
  - `merchantTransactionId` (string): The transaction ID for the merchant.
  - `merchantUserId` (string): The user ID for the merchant.
  - `name` (string): The name of the user.
  - `amount` (number): The transaction amount in paisa (1 INR = 100 paisa).
  - `redirectUrl` (string): The URL to redirect after the transaction.
  - `redirectMode` (string): The redirect mode, e.g., 'POST'.
  - `mobileNumber` (string): The mobile number of the user.
  - `paymentInstrument` (object): The payment instrument details with a property `type` (string).

Returns a promise that resolves to the response from the PhonePe API.

##### verifyTransaction(merchantTransactionId)

Verifies the status of a transaction.

- **merchantTransactionId**: The transaction ID to verify.

Returns a promise that resolves to the response from the PhonePe API.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

If you have suggestions for improving the library or want to contribute, feel free to create a pull request or open an issue.

---

With this guide, you should be able to integrate and use the QuickPhonePe library in your Node.js project seamlessly. If you encounter any issues or have questions, refer to the API documentation or seek assistance from the community.