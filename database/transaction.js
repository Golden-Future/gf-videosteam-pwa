let db = require("./db");
let Transaction = db.Transaction;

let all = () => {
  return new Promise((resolve, reject) => {
    Transaction.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let transaction = new Transaction(obj);
    transaction.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Transaction.findOne({ transaction_id: obj.transaction_id }, (err, data) => {
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
        data.type =
          obj.type == null || obj.type == undefined
            ? data.type
            : obj.type;
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
    Transaction.findOne({ transaction_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Transaction.deleteOne({ transaction_id: id }, (err, daa) => {
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
