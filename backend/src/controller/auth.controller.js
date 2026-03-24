import sendEmail from "../services/mail.service.js"
import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'

async function register(req, res, next) {

    const { username, email, password } = req.body

    const alreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (alreadyExist) {
        const message = username === alreadyExist.username
            ? "username already exist"
            : "email already exist"

        const err = new Error(message)
        err.status = 409;
        return next(err)
    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    const token = jwt.sign({
        email
    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to AtherAI!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>AtherAI</strong>. We're excited to have you on board!</p>
                <p>Please verify your account by clicking on link below</p>
                <a href='https://aether-chatbot.onrender.com/api/auth/verify?token=${token}'>Verify</a>
                <br>
                <br>
                <p>Best regards,</p>
                <p>Aryan</p>
               
        `
    })
    const response = user.toObject()
    delete response.password

    res.status(201).json({
        message: "user registered successfully, please verify via email",
        token

    })

}



async function verifyEmail(req, res, next) {
    const token = req.query.token;

    console.log(token)

    if (!token) {
        const err = new Error("token not found")
        err.status = 404
        return next(err)
    }
    let decoded;
    try {

        decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
    }
    catch (err) {
        err.status = 401
        return next(err)
    }

    const user = await userModel.findOne({ email: decoded.email }).select("-password")

   if (user.verified) {
        return res.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Already Verified</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 flex items-center justify-center p-4">
                <div class="max-w-md w-full bg-black border border-red-900/30 rounded-2xl shadow-2xl p-8 text-center">
                    <!-- Icon -->
                    <div class="flex justify-center mb-6">
                        <div class="w-20 h-20 bg-yellow-950/50 border border-yellow-900/50 rounded-full flex items-center justify-center">
                            <svg class="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    <!-- Title -->
                    <h1 class="text-3xl font-bold text-white mb-4">
                        Already Verified!
                    </h1>

                    <!-- Message -->
                    <p class="text-gray-400 mb-6">
                        Your email <span class="text-yellow-500 font-semibold">${user.email}</span> has already been verified.
                    </p>

                    <div class="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
                        <p class="text-sm text-gray-300">
                            You can now close this window and log in to your account.
                        </p>
                    </div>

                    <!-- Button -->
                    <a href="/login" class="inline-block w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 border border-yellow-800 hover:border-yellow-600">
                        Go to Login
                    </a>
                </div>
            </body>
            </html>
        `);
    }

    user.verified = true
    await user.save()
    res.cookie("token", token)

     res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verified</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 flex items-center justify-center p-4">
            <div class="max-w-md w-full bg-black border border-red-900/30 rounded-2xl shadow-2xl p-8 text-center">
                <!-- Success Icon with Animation -->
                <div class="flex justify-center mb-6">
                    <div class="relative">
                        <div class="w-20 h-20 bg-green-950/50 border border-green-900/50 rounded-full flex items-center justify-center animate-pulse">
                            <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div class="absolute inset-0 w-20 h-20 bg-green-500/20 rounded-full animate-ping"></div>
                    </div>
                </div>

                <!-- Title -->
                <h1 class="text-3xl font-bold text-white mb-4">
                    Email Verified Successfully!
                </h1>

                <!-- Message -->
                <p class="text-gray-400 mb-2">
                    Welcome, <span class="text-red-500 font-semibold">${user.username}</span>!
                </p>
                <p class="text-gray-500 text-sm mb-6">
                    ${user.email}
                </p>

                <!-- Success Box -->
                <div class="bg-green-950/30 border border-green-900/50 rounded-lg p-4 mb-6">
                    <div class="flex items-center justify-center gap-2 mb-3">
                        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <p class="text-green-400 font-semibold">Account Activated</p>
                    </div>
                    <p class="text-sm text-gray-300">
                        Your account has been successfully verified. You can now access all features.
                    </p>
                </div>

                <!-- Next Steps -->
                <div class="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6 text-left">
                    <p class="text-sm text-gray-300 mb-3">
                        <span class="font-semibold text-red-500">What's next?</span>
                    </p>
                    <ul class="text-sm text-gray-400 space-y-2">
                        <li class="flex items-start gap-2">
                            <span class="text-red-500 mt-0.5">✓</span>
                            <span>Complete your profile setup</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-red-500 mt-0.5">✓</span>
                            <span>Explore our features</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-red-500 mt-0.5">✓</span>
                            <span>Start using the platform</span>
                        </li>
                    </ul>
                </div>

                <!-- Button -->
                <a href="/dashboard" class="inline-block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 border border-red-800 hover:border-red-600 mb-4">
                    Go to Dashboard
                </a>

                <!-- Secondary Link -->
                <p class="text-sm text-gray-500">
                    or <a href="/login" class="text-red-500 hover:text-red-400 underline">Login to your account</a>
                </p>
            </div>

            <script>
                // Auto redirect after 5 seconds
                setTimeout(() => {
                    window.location.href = 'http://localhost:5173/';
                }, 5000);
            </script>
        </body>
        </html>
    `);

}

async function login(req, res, next) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        const err = new Error("invalid credentials")
        err.status = 403
        return next(err)
    }

    const validPass = await user.comparePassword(password)

    if (!validPass) {
        const err = new Error("Invalid Credentials")
        err.status = 403
        return next(err)
    }

    if (!user.verified) {
        const err = new Error("Not verified yet, first verify your account then login")
        err.status = 403
        return next(err)
    }


    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    const userObj = user.toObject()
    delete userObj.password

    res.status(201).json({
        message: "user logged in successfully",
        user: userObj
    })
}

async function getMe(req, res, next) {
    const user = req.userId

    if (!user) {
        const err = new Error("user not found")
        err.status = 404
        return next(err)
    }

    const isValid = await userModel.findById(user).select("-password")

    if (!isValid) {
        const err = new Error("invalid user")
        err.status = 403
        return next(err)
    }
    if (!isValid.verified) {
        const err = new Error("not verified")
        err.status = 403
        return next(err)
    }

    return res.status(200).json({
        user: isValid
    })

}

async function resendEmail(req, res, next) {

    const email = req.query.email



    if (!email) {
        const err = new Error("no email provided")
        err.status = 404
        next(err)
    }

    const emailExist = await userModel.findOne({ email }).select("-password")

    if (!emailExist) {
        const err = new Error("email does not exist")
        err.status = 404
        next(err)
    }

    if (emailExist.verified) {
        return res.status(200).json({
            message: "your account has already been verified"
        })
    }

    const token = jwt.sign({
        email
    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Resending Email, from Ather AI",
        html: `
                <p>Hi ${emailExist.username},</p>
                <p>Thank you for registering at <strong>Ather AI</strong>. We're excited to have you on board!</p>
                <p>Please verify your account by clicking on link below</p>
                <a href='https://aether-chabot.onrender.com/api/auth/verify?token=${token}'>Verify</a>
                <br>
                <br>
                <p>Best regards,</p>
                <p>Aryan</p>
               
        `
    })

    res.status(200).json({
        message: "email has been resended successfully"
    })
}
export default { register, login, verifyEmail, getMe, resendEmail }