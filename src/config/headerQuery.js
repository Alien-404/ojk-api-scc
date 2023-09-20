function queryPrep(signer, funcQuery, args) {
    const result = {
        headers: {
            type: "SendTransaction",
            signer: signer,
            channel: "ojk",
            chaincode: "ojk_chaincode_js"
        },
        func: funcQuery,
        args: Array.isArray(args) ? args : [],
        strongread: false
    }

    return result;
}

module.exports = queryPrep;