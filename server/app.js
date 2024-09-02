const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/db.js')

const app = express();

const whitelist = ['http://192.168.57.22:3000'];
let corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            //console.log("✅ CORS: origin allowed");
            callback(null, true);
        } else {
            callback(new Error(`${origin} not allowed by CORS`));
        }
    },
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

connectDB()
    .then(() => {
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error starting server:', error);
        process.exit(1); // Exit with failure
    });

module.exports = app



// Plaform Public Key
/* MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv81e6V+EAitfEMwhBcWaBzDAe2MyuSt81585KKE0UnSQEE2wa2GoImVTmutY6PtYWNYgjar0r59Dkp3VTmD+d69Jv7s2UUKsJIv3E7+Rp/4C5KKJTbvKNlsKCIuPyWNy3prK7OnPHo1aXR7WUccZ4d0UtLmHxAKOiVeljJgo66b8XenHYNRwb6J5qrOG/ep77djCPhBLCZZBEdjQoerfc3XkA36ZxaDPBNaFhK9y9qwwbvnm2K/uMhk4dOHpaXb/Dcm6Phr4vr/tNlgkQ8UrVZYDJSpLXNZEahaVJkgyHJ0tObEqvKl0l0uYGZMg/DIGGrSH/Q/3EeLCa90rkcmX/QIDAQAB */

// Merchant Public Key
/* MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArze39N7nltaqPLAwYJWTaXBvP0ee+Vemf5v03ueCKzDzSgyjKnL1khCnD8qwrpf1vsLhIj1wHucDMrUryC1ax7bGn9O+W2dzAqSYnBCV3Jf9HwP9bRm+beUzAoWTOlfOebrcgsTspaWmydfW+cLU3sCxs/LC6BuJkDnoQBhpPFbxpQ8e12DARInJXNpAe5OOrO0u8o/fkiZv2RqIhC81nNz365ZNG8xcssrHJvbJpxyu/RZsmwLsHXTxu3SGotJ7N1g+ZNwEqRzB+Vjq7PyNOCjsDNgnqHs/FuPsfspLzE5vSYm62/8l3tNzdmCnzfPXycUlAeXf1X0/rDOT5QbXkwIDAQAB */

//Merchant Private Key
/*MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvN7f03ueW1qo8sDBglZNpcG8/R575V6Z/m/Te54IrMPNKDKMqcvWSEKcPyrCul/W+wuEiPXAe5wMytSvILVrHtsaf075bZ3MCpJicEJXcl/0fA/1tGb5t5TMChZM6V855utyCxOylpabJ19b5wtTewLGz8sLoG4mQOehAGGk8VvGlDx7XYMBEiclc2kB7k46s7S7yj9+SJm/ZGoiELzWc3Pfrlk0bzFyyyscm9smnHK79FmybAuwddPG7dIai0ns3WD5k3ASpHMH5WOrs/I04KOwM2Ceoez8W4+x+ykvMTm9Jibrb/yXe03N2YKfN89fJxSUB5d/VfT+sM5PlBteTAgMBAAECggEBAKJwz5SvCplmzlCRL2h7gzyfRiOubI3RWsS3e18j1iPgr8yYxrRV+6C824TibsaOjv+ZgErUFpwvo2FhYQOmOKEqrB4Emlf3IkLzAaC+J5FpPvuAIXUCBu+vK4lM+N+ABCYKvOBnXNV9K5G5Ds5ieCNDFfw0NcolrXUOmmjBuN58W7eYdmZaTHvL9NQsS5m2zIK8E8J8WG26Ml293IBNykO1TGIi3gg4FJMxy1f9ZdfF4mJx2ILcSKG+RkZzXnbymf8gHoU8z3opzNKBPbeabXJI5Nn8TCxSj12Sj5mpQpYwLEweuEsNhrJm30YN2Py+QN08tM7OkBnClD3pMSQ5EUECgYEA1Y9fHeEh6EZevd+5Hp9UM5/BlBCWvH4LrdEVdAbsa4dMjlaq8oeQHLy8uIxjfPRFIZU9peAJaQYHNE6KhCxoJefBhvGGOT9ebBHVrdUaxvdjprwZkzEAvWrVgrT/kTDlq5yYX0cBkTIYqiQcicOSPOFc3ur9U5wyDXBGR7lXusMCgYEA0gm4eQhx0HnFjImSOMxaS6HaA5FAcP478UxEpJaQyUCI2mcwmuwNI+lAwDfK3fs9CVrrQsVevOIGFLU8KvPNgVEyodJKvnLMCJP8NsLaqoi1mbTztfGulf9FoS1aD4KY6dkakDvrVEbgNiaIyJbtiPXzfE02vKSsraTCd71zgvECgYAnLNOv8Xp811vNzNpyiZuylJ24AYsFLMILso0S6ao412rtuWxGbSO8gcrEt8wQQebkkDHs2bogL+DmcXnrYRIB0g+oJ2oN2lgBzwu5hZwR35PCJEM0wwp1tMFR5s3y3ltjLait4aKh9eScYV9yzhNnY5fbtJOf4Mk1ueDKi29SbQKBgHo/Lh9DyvqL5W7mozRrvCJJEZsB73/UeQ74VPt2ps57wStc4+1Hdl5wZD98OZb5o4zOXh9+wKUu6FslIN/fBr09hTqqKtat+hMEDsfQoXSgHRJZP3+mKvcinGQzATgFyvpQYiWQumdS2SyrQPF+5sHQZOb0CefB8L8gJg+LNLABAoGATU58CeVKtCoUOBGqxwHxoT8HReUNrVTARemt0PzfXZ59HXJGrwqWNWY4i8zOyX1lAo4NVUuMOZlU+2A0HkkTfidUoYQjyovMrOc/H8R234Nzm2UULWIFRHAspmEa70K3XFnNd3hj/WYAILg4YnZ2Acasnwcp56BGX0n0Onjy+M8= */