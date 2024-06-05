const axios = require('axios');
const crypto = require('crypto');

/**
 * @typedef {Object} PaymentInstrument
 * @property {string} type - The type of the payment instrument, e.g., 'PAY_PAGE'.
 */

/**
 * @typedef {Object} TransactionData
 * @property {string} merchantTransactionId - The transaction ID for the merchant.
 * @property {string} merchantUserId - The user ID for the merchant.
 * @property {string} name - The name of the user.
 * @property {number} amount - The transaction amount in paisa (1 INR = 100 paisa).
 * @property {string} redirectUrl - The URL to redirect after the transaction.
 * @property {string} redirectMode - The redirect mode, e.g., 'POST'.
 * @property {string} mobileNumber - The mobile number of the user.
 * @property {PaymentInstrument} paymentInstrument - The payment instrument details.
 */

/**
 * QuickPhonePe class to interact with PhonePe payment gateway.
 */
class QuickPhonePe {
    /**
     * Constructor to initialize the QuickPhonePe instance.
     * @param {Object} config - The configuration object.
     * @param {string} config.merchantId - The Merchant ID provided by PhonePe.
     * @param {string} config.saltKey - The Salt Key provided by PhonePe for hashing.
     * @param {number} [config.keyIndex=1] - The Key Index for the salt key, default is 1.
     * @param {("DEV"|"PROD")} [config.mode="DEV"] - The mode of the API, either 'DEV' for sandbox or 'PROD' for production.
     */
    constructor({ merchantId, saltKey, keyIndex = 1, mode = "DEV" }) {
        this.merchantId = merchantId;
        this.saltKey = saltKey;
        this.keyIndex = keyIndex;
        this.mode = mode;
    }

    /**
     * Get the appropriate URL for the payment link based on the mode.
     * @returns {string} The URL for the payment link.
     */
    _getPayLink() {
        const urls = {
            DEV: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1",
            PROD: "https://api.phonepe.com/apis/hermes/pg/v1"
        };
        return urls[this.mode.toUpperCase()];
    }

    /**
     * Generate checksum for the request.
     * @param {string} payload - The payload to be hashed.
     * @param {string} endpoint - The endpoint for which the checksum is generated.
     * @returns {string} The generated checksum.
     */
    _generateChecksum(payload, endpoint) {
        const stringToHash = `${payload}${endpoint}${this.saltKey}`;
        const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
        return `${sha256}###${this.keyIndex}`;
    }

    /**
     * Create a transaction using PhonePe payment gateway.
     * @param {TransactionData} data - The transaction data.
     * @returns {Promise<Object>} The response from PhonePe API.
     * @throws Will throw an error if the request fails.
     */
    async createTransaction(data) {
        const payload = JSON.stringify({ ...data, merchantId: this.merchantId });
        const payloadBase64 = Buffer.from(payload).toString("base64");
        const checksum = this._generateChecksum(payloadBase64, "/pg/v1/pay");

        const options = {
            method: "POST",
            url: `${this._getPayLink()}/pay`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
            },
            data: {
                request: payloadBase64,
            },
        };

        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            throw new Error(error?.response?.data || error);
        }
    }

    /**
     * Verify the status of a transaction.
     * @param {string} merchantTransactionId - The transaction ID to verify.
     * @returns {Promise<Object>} The response from PhonePe API.
     * @throws Will throw an error if the request fails.
     */
    async verifyTransaction(merchantTransactionId) {
        const endpoint = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}`;
        const checksum = this._generateChecksum("", endpoint);

        const options = {
            method: "GET",
            url: `${this._getPayLink()}${endpoint}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "X-MERCHANT-ID": this.merchantId,
            },
        };

        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            throw new Error(error?.response?.data || error);
        }
    }
}

// Export the QuickPhonePe class
module.exports = QuickPhonePe;
