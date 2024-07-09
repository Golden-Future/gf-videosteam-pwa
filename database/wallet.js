let db = require("./db");
let Wallet = db.Wallet;

let all = () => {
  return new Promise((resolve, reject) => {
    Wallet.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let wallet = new Wallet(obj);
    wallet.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Wallet.findOne({ wallet_id: obj.wallet_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.user_id =
          obj.user_id == null || obj.user_id == undefined
            ? data.user_id
            : obj.user_id;
        data.balance =
          obj.balance == null || obj.balance == undefined
            ? data.balance
            : obj.balance;
        data.control =
          obj.control == null || obj.control == undefined
            ? data.control
            : obj.control;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) reject(error);
          resolve(datas);
        });
      }
    });
  });
};

let find = (id) => {
  return new Promise((resolve, reject) => {
    Wallet.findOne({ wallet_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Wallet.deleteOne({ wallet_id: id }, (err, daa) => {
      if (err) reject(err);
      resolve(daa);
    });
  });
};

module.exports = {
  all,
  save,
  update,
  find,
  destory,
};
