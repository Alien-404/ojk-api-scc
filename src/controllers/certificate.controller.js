const axiosInstance = require('../config/axios');
const queryPrep = require('../config/headerQuery');
const certificateValidationSchema = require('../utils/validations/certificate.schema');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createId } = require('@paralleldrive/cuid2');

module.exports = {

    index: async (req, res, next) => {
        // #swagger.tags = ['Certificate']
        /* #swagger.security = [{
           "bearer_auth": []
       }] */
        try {
            const user = req.user;
            const certificates = await axiosInstance.post(`/query`, queryPrep(user.email, 'GetAllAssets', []));

            return res.status(200).json({
                status: true,
                message: 'success!',
                data: {
                    certificates: certificates.data.result
                },
            });
        } catch (error) {
            next(error);
        }
    },

    own: async (req, res, next) => {
        // #swagger.tags = ['Certificate']
        /* #swagger.security = [{
           "bearer_auth": []
       }] */
        try {
            const user = req.user;
            const certificates = await axiosInstance.post(`/query`, queryPrep(user.email, 'GetAllAssets', []));

            const userCertificate = certificates.data.result.filter(obj => obj.accountID === user.accountId);

            return res.status(200).json({
                status: true,
                message: 'success!',
                data: {
                    certificatess: userCertificate,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    history: async (req, res, next) => {
        // #swagger.tags = ['Certificate']
        /* #swagger.security = [{
           "bearer_auth": []
       }] */
        try {
            const user = req.user;
            const id = req.params.id;

            const certificate = await axiosInstance.post(`/query`, queryPrep(user.email, 'ReadAssetByTxID', [id]));

            return res.status(200).json({
                status: true,
                message: 'success!',
                data: {
                    certificate: certificate.data.result,
                },
            });

        } catch (error) {
            next(error);
        }
    },

    single: async (req, res, next) => {
        // #swagger.tags = ['Certificate']
        /* #swagger.security = [{
           "bearer_auth": []
       }] */
        try {
            const user = req.user;
            const id = req.params.id;

            const certificate = await axiosInstance.post(`/query`, queryPrep(user.email, 'ReadAsset', [id]));

            return res.status(200).json({
                status: true,
                message: 'success!',
                data: {
                    certificate: certificate.data.result,
                },
            });
        } catch (error) {
            if (error.response.data.error = 'Transaction processing for endorser [k0fhskrb5y.k0i6khldkt.kaleido.network:40060]: Chaincode status Code: (500) UNKNOWN. Description: The T74RmLvbKfgaEiP5Qa does not exist') {
                next({
                    statusCode: 404,
                    message: error.response.data.error
                });
            } else {
                next(error);
            }

        }
    },

    create: async (req, res, next) => {
        // #swagger.tags = ['Certificate']
        /* #swagger.security = [{
            "bearer_auth": []
        }] */
        try {
            const user = req.user;
            const { error, value } = certificateValidationSchema.validate(req.body);

            // check if error
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: error.details[0].message,
                    data: null,
                });
            }

            // gen
            const userInfo = await prisma.user.findFirst({
                where: {
                    email: user.email
                }
            });
            const certificateID = createId();
            const { name, title, issueDate, status, expiredDate } = value;

            // store to blockchain
            const certificate = await axiosInstance.post(`/transactions?fly-sync=true`, {
                headers: {
                    type: "SendTransaction",
                    signer: user.email,
                    channel: "default-channel",
                    chaincode: "ojk_chaincode_js"
                },
                func: "createAsset",
                args: [
                    certificateID,
                    userInfo.accountId,
                    name,
                    title,
                    issueDate,
                    status,
                    expiredDate
                ],
                transientMap: {},
                init: false
            });

            // store to db
            await prisma.certificate.create({
                data: {
                    certificateID: certificateID,
                    userId: userInfo.id
                }
            })

            return res.status(201).json({
                status: true,
                message: 'created!',
                data: certificate.data,
            });
        } catch (error) {
            next(error);
        }
    }
}