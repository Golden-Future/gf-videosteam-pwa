let db = require("./db");
let User = db.User;

let all = () => {
  return new Promise((resolve, reject) => {
    User.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let user = new User(obj);
    user.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    User.findOne({ user_id: obj.user_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.username =
          obj.username == null || obj.username == undefined
            ? data.username
            : obj.username;
        data.email =
          obj.email == null || obj.email == undefined ? data.email : obj.email;
        data.password =
          obj.password == null || obj.password == undefined
            ? data.password
            : obj.password;
        data.role =
          obj.role == null || obj.role == undefined ? data.role : obj.role;
        data.name =
          obj.name == null || obj.name == undefined ? data.name : obj.name;
        data.phone =
          obj.phone == null || obj.phone == undefined ? data.phone : obj.phone;
        obj.login == null || obj.login == undefined ? data.login : obj.login;

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
    User.findOne({ user_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let findEmail = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    User.deleteOne({ user_id: id }, (err, daa) => {
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
  findEmail,
  destory,
};

