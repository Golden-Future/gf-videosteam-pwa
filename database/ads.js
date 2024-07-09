let db = require("./db");
let Ads = db.Ads;

let all = () => {
  return new Promise((resolve, reject) => {
    Ads.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let ads = new Ads(obj);
    ads.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Ads.findOne({ ads_id: obj.ads_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
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
    Ads.findOne({ ads_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Ads.deleteOne({ ads_id: id }, (err, daa) => {
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
