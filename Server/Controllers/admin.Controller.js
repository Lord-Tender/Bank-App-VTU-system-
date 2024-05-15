const { adminUser, dataPlans } = require("../Models/admin.Model")
const { userModel, reservedAccount, debitTransaction, creditTransaction, flutterTransaction } = require("../Models/user.Model");
const bcrypt = require('bcrypt');


const addAdminUser = (req, res) => {
    const { email, role, fullName, password } = req.body
    let hashPassword = bcrypt.hashSync(password, 10)
    let admin = new adminUser({
        email,
        role,
        fullName,
        password: hashPassword
    })
    admin.save()
        .then((response) => {
            console.log(response)
            res.status(200).json({ status: true, msg: "User added successfully" })
        })
        .catch((err) => {
            console.log(err);
            res.status(200).json({ status: false, msg: "An error occured", error: err })
        })
}

const fetchAllUser = async (req, res) => {
    try {
        let allUsers = await userModel.find({})
        res.status(200).json({ status: true, allUsers })
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: err })
    }
}

const creditUser = async (req, res) => {
    const { userEmail, amount } = req.body
    let user = await userModel.findOne({ 'emailInfo.email': userEmail })
    if (user) {
        let oldBalance = Number(user.accountBal)
        const newBalance = oldBalance + Number(amount)
        user.accountBal = newBalance
        user.save()
        .then((response)=>{
            res.status(200).json({msg: "Success", status: true, response})
        })
        .catch((err)=>{
            res.status(400).json({msg: "unsuccessful", status: false, error: err})
        })
    } else {
        res.status(500).json({ msg: "An error occured" })
    }
}

const debitUser = async (req, res) => {
    const { userEmail, amount } = req.body
    let user = await userModel.findOne({ 'emailInfo.email': userEmail })
    if (user) {
        let oldBalance = Number(user.accountBal)
        const newBalance = oldBalance - Number(amount)
        user.accountBal = newBalance
        user.save()
        .then((response)=>{
            res.status(200).json({msg: "Success", status: true, response})
        })
        .catch((err)=>{
            res.status(400).json({msg: "unsuccessful", status: false, error: err})
        })
    } else {
        res.status(500).json({ msg: "An error occured" })
    }
}

const getAllTransaction = (req, res) => {
    let debitTransaction = debitTransaction.find({})
    let creditTransaction = debitTransaction.find({})
    let flutterTransaction = debitTransaction.find({})
    if (debitTransaction && creditTransaction && flutterTransaction) {
        res.status(200).json({ status: true, debitTransaction, creditTransaction, flutterTransaction })
    }else{
        res.status(500).json({ status: false, msg: "Am error occurred"  })
    }
}

const addNetwork = (req, res) => {
    const { network_id, network_name } = req.body
    let network = new dataPlans({
        network_id,
        network_name,
        dataPlans: []
    })
    network.save()
    .then((data)=>{
        res.status(200).json({ status: true, msg: "added successful", data })
    })
    .catch((error)=>{
        res.status(400).json({ status: false, msg: "an error occurred", error })
    })
}

const addDataPlan = (req, res) =>{
    const { network_id, server_id, price, byte } = req.body
    let newPlan = { server_id, price, byte }
    let network = dataPlans.findOne({ network_id })
    if (network) {
        let plan = network.dataPlans
        plan.push(newPlan)
        network.save()
        .then((data)=>{
            res.status(200).json({ status: true, msg: "added successful", data })
        })
        .catch((error)=>{
            res.status(400).json({ status: false, msg: "an error occurred", error })
        })
    }

}

module.exports = { addAdminUser, fetchAllUser, creditUser, debitUser, getAllTransaction, addNetwork, addDataPlan }