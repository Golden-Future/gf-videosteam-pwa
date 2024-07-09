const mongoose = require("mongoose");
let paginate = require("mongoose-paginate");
let url = "mongodb://127.0.0.1:27017/VIDEOSTREAMPWA";
const connect = mongoose.connect(url, { useNewUrlParser: true });
let autoI = require("simple-mongoose-autoincrement");
let Schema = mongoose.Schema;
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const encryptionKey = (process.env.ENCRYPTION_KEY || 'GOLD_FUTURE$^&*@').padEnd(32, ' '); // Pad to 32 chars
const ivLength = 16;

let encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'utf-8'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};
let userScheme = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  login: { type: Boolean, required: true },
  role: { type: String, required: true },
  since: { type: Date, required: true },
});

let walletScheme = new Schema({
  user_id: { type: String, required: true },
  balance: { type: Number, required: true },
  control: { type: Boolean, required: true },
  since: { type: Date, required: true },
});

let transactionScheme = new Schema({
  user_id: { type: String, required: true },
  balance: { type: Number, required: true },
  type: {type: String,required:true},
  since: { type: Date, required: true },  
})

let PostScheme = new Schema({
  title: { type: String, required: true },
  imgurl: { type: String, required: true },
  url: { type: String, required: true },
  since: { type: Date, required: true },
});

let systemScheme = new Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  since: { type: Date, required: true },
});

let socialScheme = new Schema({
  icon: { type: String, required: true },
  url: { type: String, required: true },
  since: { type: Date, required: true },
});

let adsScheme = new Schema({
  url: { type: String, required: true },
  since: { type: Date, required: true }
})

adsScheme.plugin(autoI, { field: "ads_id" });
adsScheme.plugin(paginate);
let Ads = mongoose.model("Ads", adsScheme);

transactionScheme.plugin(autoI, { field: "transaction_id" });
transactionScheme.plugin(paginate);
let Transaction = mongoose.model("Transactions", transactionScheme);

socialScheme.plugin(autoI, { field: "social_id" });
socialScheme.plugin(paginate);
let Social = mongoose.model("Socials", socialScheme);

walletScheme.plugin(autoI, { field: "wallet_id" });
walletScheme.plugin(paginate);
let Wallet = mongoose.model("Wallets", walletScheme);

PostScheme.plugin(autoI, { field: "post_id" });
PostScheme.plugin(paginate);
let Post = mongoose.model("Posts", PostScheme);

userScheme.plugin(autoI, { field: "user_id" });
userScheme.plugin(paginate);
let User = mongoose.model("Users", userScheme);

systemScheme.plugin(autoI, { field: "system_id" });
systemScheme.plugin(paginate);
let System = mongoose.model("Systems", systemScheme);

module.exports = {
  User,
  System,
  Wallet,
  Post,
  Ads,
  Social,
  Transaction,
  encrypt,
};
