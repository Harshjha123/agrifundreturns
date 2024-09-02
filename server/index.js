const app = require('./app'); 

const limiter = require('./middleware/limiter');
const verify = require('./middleware/authenticate');

const { body, validationResult, query } = require('express-validator');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const moment = require('moment-timezone');

const User = require('./models/user');
const Balance = require('./models/balance');
const Investments = require('./models/invest')
const Referral = require('./models/referral');
const ReferralRec = require('./models/referralRec');
const Status = require('./models/status');
const Financial = require('./models/financial');
const SiteStatus = require('./models/siteStatus');

const plans = require('./array/plans')

const defaultId = process.env.GLOBAL_ID;

const limiter2 = rateLimit({
    windowMs: 100,
    max: 1,
    keyGenerator: (req) => {
        return req.body.phone || '';
    },
});

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

async function firstRun() {
    let i = await SiteStatus.findOne({ id: defaultId })

    if (!i) {
        await (new SiteStatus({ id: defaultId })).save()
        return;
    }

    return;
}

firstRun();


const formatTimestamp = (dateString) => {
    const indiaTime = moment.tz(dateString, 'Asia/Kolkata').format('h:mmA, D MMM YYYY');
    return indiaTime;
};

const formatTimestamp2 = (dateString) => {
    const indiaTime = moment.tz(dateString, 'Asia/Kolkata').format('D MMM YYYY');
    return indiaTime;
};

const updateSiteStatus = async (amount) => {
    const indiaTime = moment.tz('Asia/Kolkata');
    const date = indiaTime.format('DD/MM/YYYY');

    let siteStatus = await SiteStatus.findOne({ id: defaultId });

    if (siteStatus) {
        const dailyIndex = siteStatus.daily.findIndex(d => d.date === date);

        if (dailyIndex === -1) {
            await SiteStatus.findOneAndUpdate({ id: defaultId }, {
                $inc: { investments: amount },
                $push: {
                    daily: {
                        inrDeposits: 0,
                        cryptoDeposits: 0,
                        inrDepositTax: 0,
                        cryptoDepositTax: 0,
                        date: date,
                        inrPayouts: 0,
                        cryptoPayouts: 0,
                        inrPayoutsTax: 0,
                        cryptoPayoutsTax: 0,
                        investments: amount,
                        return: 0,
                        users: 0
                    }
                }
            });
        } else {
            await SiteStatus.findOneAndUpdate(
                { id: defaultId, 'daily.date': date },
                {
                    $inc: {
                        investments: amount,
                        'daily.$.investments': amount
                    }
                }
            );
        }
    }
};

app.post('/user/register', limiter2, [
    body('phone').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please enter a valid phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ message: firstError.msg });
    }

    try {
        const { phone, password, name, inviteCode: inviter, captchaToken } = req.body;

        if (!name) return res.status(400).json({ message: 'Please enter your name'})

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        let inviterUser;
        if (inviter) {
            inviterUser = await User.findOne({ id: inviter });
            if (!inviterUser) {
                return res.status(400).json({ message: 'Invalid invitation code' });
            }
        }

        /*const captchaResponse = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: captchaToken
                }
            }
        );

        if (!captchaResponse.data.success) {
            return res.status(400).json({ message: 'Captcha verification failed' });
        } */

        const id = randomString(6, '0123456789');

        const newUser = new User({
            id,
            name,
            phone,
            password,
            date: new Date().getTime()
        });

        if (inviter) {
            newUser.lv1 = inviter;
            newUser.lv2 = inviterUser.lv1;
            newUser.lv3 = inviterUser.lv2;
        }

        await newUser.save();
        await new Balance({ id }).save();
        await new Referral({ id }).save();
        await new Status({ id }).save();

        const financialRecord = new Financial({
            id,
            item: 'Sign-up Bonus',
            type: true,
            amount: 49,
            date: Date.now()
        });

        await financialRecord.save();

        const indiaTime = moment.tz('Asia/Kolkata');
        const date = indiaTime.format('DD/MM/YYYY');

        const siteStatus = await SiteStatus.findOne({ id: defaultId });

        if (siteStatus) {
            const dailyIndex = siteStatus.daily.findIndex(d => d.date === date);
            if (dailyIndex === -1) {
                await SiteStatus.findOneAndUpdate({ id: defaultId }, {
                    $inc: { users: 1 },
                    $push: {
                        daily: {
                            cryptoDeposits: 0,
                            cryptoDepositTax: 0,
                            inrDeposits: 0,
                            inrDepositTax: 0,
                            date: date,
                            cryptoPayouts: 0,
                            cryptoPayoutsTax: 0,
                            inrPayouts: 0,
                            inrPayoutsTax: 0,
                            investments: 0,
                            return: 0,
                            users: 1
                        }
                    }
                });
            } else {
                await SiteStatus.findOneAndUpdate(
                    { id: defaultId, 'daily.date': date },
                    {
                        $inc: { users: 1, 'daily.$.users': 1 }
                    }
                );
            }
        }

        const maskedPhone = phone.replace(/(\d{6})(\d{4})/, '******$2');

        if (newUser.lv1) {
            await Referral.findOneAndUpdate({ id: newUser.lv1 }, {
                $inc: { 'users.lv1': 1 }
            });

            await new ReferralRec({
                id: newUser.lv1,
                user: id,
                name,
                phone: `+91 ${maskedPhone}`,
                level: 1,
                date: Date.now(),
                commission: 0,
                investments: 0
            }).save();
        }

        if (newUser.lv2) {
            await Referral.findOneAndUpdate({ id: newUser.lv2 }, {
                $inc: { 'users.lv2': 1 }
            });

            await new ReferralRec({
                id: newUser.lv2,
                user: id,
                phone: `+91 ${maskedPhone}`,
                level: 2,
                date: Date.now(),
                commission: 0,
                investments: 0
            }).save();
        }

        if (newUser.lv3) {
            await Referral.findOneAndUpdate({ id: newUser.lv3 }, {
                $inc: { 'users.lv3': 1 }
            });

            await new ReferralRec({
                id: newUser.lv3,
                user: id,
                phone: `+91 ${maskedPhone}`,
                level: 3,
                date: Date.now(),
                commission: 0,
                investments: 0
            }).save();
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('/register error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/user/login', limiter2, [
    body('phone').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please enter a valid phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ message: firstError.msg });
    }

    try {
        const { phone, password } = req.body;

        const isUser = await User.findOne({ phone, password })
        if (!isUser) return res.status(401).json({ message: 'Account not exist' });

        const token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' });
        return res.status(200).json({ token })
    } catch (error) {
        console.error('/login error: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/index/main', verify, limiter, async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(400).json({ message: 'User ID not found in request' });
        }

        const [user, balance, referral, status] = await Promise.all([
            User.findOne({ id }),
            Balance.findOne({ id }),
            Referral.findOne({ id }),
            Status.findOne({ id })
        ]);

        //console.log('Invest: ', invest)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let ref_rewards = 0;
        for (let i = 0; i < user.level?.length; i++) {
            const atr = [2, 5, 10, 20, 50, 100, 200, 350, 600];
            const lvt = user.level[i] === 1 ? 142 : (atr[user.level[i] - 1] - atr[user.level[i] - 2]) * 71

            ref_rewards += lvt
        }

        const data = {
            plan: plans,
            id,
            name: user.name,
            phone: String(user.phone).replace(/(\d{6})(\d{4})/, '******$2'),
            vip: user.vip || 0,
            referrals: {
                verified: referral ? referral.verified : false,
                rewards: ref_rewards,
                rewards_claimed: user.level,
                commission: {
                    lv1: referral ? referral.income.lv1 : 0,
                    lv2: referral ? referral.income.lv2 : 0,
                    lv3: referral ? referral.income.lv3 : 0
                },
                recharges: {
                    lv1: referral ? referral.deposits.lv1 : 0,
                    lv2: referral ? referral.deposits.lv2 : 0,
                    lv3: referral ? referral.deposits.lv3 : 0
                },
                users: {
                    lv1: referral ? referral.users.lv1 : 0,
                    lv2: referral ? referral.users.lv2 : 0,
                    lv3: referral ? referral.users.lv3 : 0
                }
            },
            balance: {
                withdraw: balance ? balance.withdraw : 0,
                recharge: balance ? balance.deposit : 0,
                commission: balance ? balance.team : 0,
                income: balance ? balance.revenue : 0,
                reward: balance ? balance.reward : 0
            },
            status: {
                deposits: status ? status.deposits : 0,
                withdrawals: status ? status.withdrawals : 0,
                investments: status && status.investments ? status.investments.total : 0,
                returns: status ? status.revenue : 0
            }
        };

        // Send the response with the user data
        return res.status(200).json(data);
    } catch (error) {
        console.error('/index/main error: ', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

app.post('/invest', verify, limiter, async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;

        const product = plans.find(x => x.id === product_id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { cost, daily, period } = product;

        const user = await User.findOne({ id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        /*const userInvestmentsCount = await Invest.countDocuments({ product_id, id: userId });
        if (userInvestmentsCount >= quota) {
            return res.status(400).json({ message: 'You have already reached the maximum limit for purchasing this product' });
        } */

        const balance = await Balance.findOne({ id: userId });
        const availableFunds = balance.deposit + balance.withdraw
        if (availableFunds < cost) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const userStatus = await Status.findOne({ id: userId });
        /*if (userStatus.investments.total < required) {
            return res.status(400).json({ message: `Your total investment amount should be ₹${required} to invest in this plan` });
        } */

        const investmentId = crypto.randomBytes(64).toString('hex');
        userStatus.investments.active += cost;
        userStatus.investments.total += cost;

        const newInvestment = new Investments({
            id: userId,
            product_id,
            cost,
            daily,
            date: Date.now(),
            day: 0,
            total: 0,
            hex: investmentId,
            period,
            expired: false,
            recharges: userStatus.deposits,
            payouts: userStatus.withdrawals,
            investments: userStatus.investments.total,
            lastRun: Date.now()
        });

        const financialRecord = new Financial({
            id: userId,
            item: `New Investment`,
            type: false,
            amount: cost,
            date: Date.now()
        });

        await newInvestment.save();
        await financialRecord.save();
        await userStatus.save();

        await Balance.findOneAndUpdate({ id: userId }, {
            $inc: {
                deposit: balance.deposit < cost ? -balance.deposit : -cost,
                withdraw: balance.deposit < cost ? -(cost - balance.deposit) : 0,
                investments: cost,
            }
        });

        if (!user.verified) {
            user.verified = true;
            await user.save();

            await Referral.findOneAndUpdate({ id: user.lv1 }, {
                $inc: { verified: 1 }
            });
        }

        const formattedPhone = String(user.phone).replace(/(\d{6})(\d{4})/, '******$2');

        const referralLevels = [
            { level: 1, percent: 0.16, refId: user.lv1 },
            { level: 2, percent: 0.04, refId: user.lv2 },
            { level: 3, percent: 0.01, refId: user.lv3 }
        ];

        for (const { level, percent, refId } of referralLevels) {
            if (refId) {
                const commission = cost * percent;
                await Referral.updateOne({ id: refId }, {
                    $inc: {
                        [`income.lv${level}`]: commission,
                        [`investments.lv${level}`]: cost
                    }
                });

                await ReferralRec.findOneAndUpdate({ user: userId, level }, {
                    $inc: {
                        investments: cost,
                        commission
                    }
                });

                await Balance.findOneAndUpdate({ id: refId }, {
                    $inc: {
                        withdraw: commission,
                        team: commission
                    }
                });

                /*
                const commissionRecord = new Commission({
                    id: refId,
                    user: userId,
                    phone: `+${user.isd} ${formattedPhone}`,
                    level,
                    commission,
                    investments: cost,
                    date: Date.now()
                });

                await commissionRecord.save(); */

                const lvlFinancialRecord = new Financial({
                    id: refId,
                    item: `Lv${level} Commission`,
                    type: true,
                    amount: commission,
                    date: Date.now()
                });

                await lvlFinancialRecord.save();
            }
        }

        await updateSiteStatus(cost)

        // Send success response
        return res.sendStatus(200);
    } catch (error) {
        console.error('/invest error: ', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/get/investments', verify, limiter, [
    query('expired').optional().isBoolean().withMessage('Expired must be a boolean')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { expired } = req.query;
        const id = req.user.id;

        const isExpired = expired === 'true';
        let records = await Investments.find({ id, expired: isExpired }).sort({ _id: -1 });

        const getStatus = await Status.findOne({ id });
        if (!getStatus) {
            return res.status(404).json({ message: 'User status not found' });
        }

        records = records.map(record => ({
            ...record._doc,
            date: formatTimestamp2(record.date + (1000 * 60 * 60 * record.day))
        }));

        const data = {
            investments: getStatus.investments.total || 0,
            returns: getStatus.revenue || 0,
            records
        };

        return res.status(200).json(data);
    } catch (error) {
        console.error('/investments error: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/billing/records', verify, limiter, async (req, res) => {
    try {
        const userId = req.user.id;

        let records = await Financial.find({ id: userId }).sort({ _id: -1 }).limit(100);

        if (!records || records.length === 0) {
            return res.status(404).json({ message: 'No financial records found.' });
        }

        records = records.map(record => ({
            ...record._doc,
            date: formatTimestamp(record.date)
        }));

        return res.status(200).json({ records });
    } catch (error) {
        console.error('/billing/records error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/claim/reward', verify, limiter, async (req, res) => {
    try {
        const id = req.user.id;
        const level = parseInt(req.query.level, 10);

        console.log(level)

        if (isNaN(level) || level < 1 || level > 9) {
            return res.status(400).json({ message: 'Invalid level parameter' });
        }

        const refArray = [2, 5, 10, 20, 50, 100, 200, 350, 700];

        const [user, referral] = await Promise.all([
            User.findOne({ id }),
            Referral.findOne({ id })
        ]);

        const { verified: getVerifiedReferrals } = referral || {};
        const { level: getLevel } = user || [];

        if (!user || !referral) {
            return res.status(404).json({ message: 'User or Referral data not found' });
        }

        if (getVerifiedReferrals < refArray[level - 1]) {
            return res.status(400).json({ message: 'You are not eligible to claim this reward' });
        }

        if (getLevel.includes(level)) {
            return res.status(400).json({ message: 'You have already claimed this reward' });
        }

        const amount = level === 1
            ? 142
            : (refArray[level - 1] * 71) - (refArray[level - 2] * 71);

        await Promise.all([
            User.findOneAndUpdate({ id }, { $push: { level } }),
            Balance.findOneAndUpdate({ id }, { $inc: { withdraw: amount } }),
            new Financial({
                id,
                item: `Referral Reward`,
                type: true,
                amount,
                date: Date.now()
            }).save()
        ]);

        getLevel.push(level);

        return res.status(200).json({ referrals: getVerifiedReferrals, levels: getLevel });
    } catch (error) {
        console.error('/claim/reward error: ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});