let db = require("./db");
let Post = db.Post;

let all = () => {
  return new Promise((resolve, reject) => {
    Post.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let post = new Post(obj);
    post.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Post.findOne({ post_id: obj.post_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.title =
          obj.title == null || obj.title == undefined ? data.title : obj.title;
        data.imgurl =
          obj.imgurl == null || obj.imgurl == undefined
            ? data.imgurl
            : obj.imgurl;
        data.url = obj.url == null || obj.url == undefined ? data.url : obj.url;
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
    Post.findOne({ post_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Post.deleteOne({ post_id: id }, (err, daa) => {
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
