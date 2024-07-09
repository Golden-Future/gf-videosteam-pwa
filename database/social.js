let db = require("./db");
let Social = db.Social;

let all = () => {
  return new Promise((resolve, reject) => {
    Social.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let social = new Social(obj);
    social.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Social.findOne({ social_id: obj.social_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.icon =
          obj.icon == null || obj.icon == undefined ? data.icon : obj.icon;
        data.url =
          obj.url == null || obj.url == undefined
            ? data.url
            : obj.url;
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
    Social.findOne({ social_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Social.deleteOne({ social_id: id }, (err, daa) => {
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
