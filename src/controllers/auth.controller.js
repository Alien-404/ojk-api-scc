const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerValidationSchema = require("../utils/validations/register.schema");
const axiosInstance = require('../config/axios');
const loginValidationSchema = require('../utils/validations/login.schema');
const { generateToken } = require('../utils/lib/jwt.lib');

module.exports = {
    register: async (req, res, next) => {
        // #swagger.tags = ['Auth']
        try {
            const { error, value } = registerValidationSchema.validate(req.body);

            // check if error
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: error.details[0].message,
                    data: null,
                });
            }

            // hit the peer
            const isUser = await prisma.user.findFirst({
                where: {
                    email: value.email
                }
            });

            // // check if user registered
            if (isUser) {
                return res.status(409).json({
                    status: false,
                    message: 'user already exist!',
                    data: null,
                });
            }

            // // hash password
            const hashPassword = await bcrypt.hash(value.password, await bcrypt.genSalt(10));

            // // save to db
            const user = await prisma.user.create({
                data: {
                    email: value.email
                }
            })

            // save to CA and enroll
            const saveUser = await axiosInstance.post(`/identities`, {
                name: value.email,
                type: "client",
                maxEnrollments: 1,
                attributes: {
                    password: hashPassword,
                    name: value.name,
                    accoundID: user.accountId
                }
            });

            await axiosInstance.post(`/identities/${value.email}/enroll`, {
                secret: saveUser.data.secret,
                attributes: {}
            });


            return res.status(201).json({
                status: true,
                message: 'user created!',
                data: null,
            });

        } catch (error) {
            next(error);
        }
    },

    login: async (req, res, next) => {
        // #swagger.tags = ['Auth']
        try {
            const { error, value } = loginValidationSchema.validate(req.body);

            // check if error
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: error.details[0].message,
                    data: null,
                });
            }

            // check user
            const isUser = await prisma.user.findFirst({
                where: {
                    email: value.email
                }
            });

            if (!isUser) {
                return res.status(404).json({
                    status: false,
                    message: 'credential not found!',
                    data: null,
                });
            }

            // validate password
            const userInfo = await axiosInstance.get(`/identities/${value.email}`);
            const isPasswordValid = await bcrypt.compare(value.password, userInfo.data.attributes.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    status: false,
                    message: 'credential not valid!',
                    data: null,
                });
            }

            // gen token
            const accessToken = generateToken({ email: isUser.email, name: userInfo.data.attributes.name, accountId: isUser.accountId }, '7h');

            return res.status(200).json({
                status: true,
                message: 'success!',
                data: {
                    access_token: accessToken,
                },
            });

        } catch (error) {
            next(error);
        }
    }
}