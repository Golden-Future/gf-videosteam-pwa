let multer = require("multer");
let fs = require("fs");
let unique_username = require("unique-username-generator");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "_" + file.originalname);
  },
});

const { encrypt } = require("../database/db");
const upload = multer({ storage: storage });
let express = require("express");
module.exports = () => {
  let router = express.Router();
  let jwt = require("jsonwebtoken"),
    passport = require("passport"),
    bcrypt = require("../helper/pass");
  // Database file import
  let User = require("../database/user");
  let Post = require("../database/post");
  let System = require("../database/user");
  let Transaction = require("../database/transaction");
  let Social = require("../database/social");
  let Ads = require("../database/ads");
  
  // ****** USER ******* //

  router.get("/superuser/user", (req, res) => { // ALL USER
    User.all()
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({
          con: true,
          data: encryptedData,
          msg: "Success",
          status: 200,
          length: result.length,
        });
      })
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Fail`, status: 304 })
      );
  });

  router.post("/superuser/login/user", (req, res) => { // LOGIN USER
    let email = req.body.email;
    let password = req.body.password;
    User.findEmail(email)
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        bcrypt
          .compare(password, result.password)
          .then((data) => {
            if (data) {
              let payload = { email: result.email, name: result.name };
              let token = jwt.sign(payload, process.env.SECRET);
              res.json({
                con: true,
                token: token,
                data: encryptedData,
                msg: `Successs`,
              });
            } else {
              res.json({ con: false, msg: "Fail" });
            }
          })
          .catch((error) =>
            res.json({ con: false, data: error, msg: `Fail` })
          );
      })
      .catch((erro) => res.json({ con: false, data: erro, msg: `Fail` }));
  });

  router.post("/superuser/register/user", (req, res) => { // REGISTER USER
    let phone = req.body.phone;
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;
    let name = req.body.name;
    let username = unique_username.generateUsername("", 3, 20);

    bcrypt
      .encrypt(password)
      .then((result) => {
        let obj = {
          phone: phone,
          email: email,
          password: result,
          role: role,
          name: name,
          username: username,
          login: false,
        };
        User.save(obj)
          .then((data) => {
            const encryptedData = encrypt(JSON.stringify(data));
            res.json({ con: true, data: encryptedData, msg: `Success` });
          })
          .catch((error) =>
            res.json({ con: false, data: error, msg: "Fail" })
          );
      })
      .catch((eee) =>
        res.json({ con: false, data: eee, msg: `Fail` })
      );
  });

  router.put("/superuser/password", (req, res) => { // RESET PASSWORD
    let password = unique_username.generateUsername("", 3, 20);
    bcrypt.encrypt(password)
      .then((result) => {
        let obj = {
          user_id: req.body.user_id,
          password: result
        };
        User.update(obj)
          .then((resu) => {
            let newObj = {
              newPassword: password,
              ...resu
            }
            const encryptedData = encrypt(JSON.stringify(newObj));
            res.json({ con: true, data: encryptedData, msg: `Success`,dd:resu, status: 200 })
          })
          .catch((error) => res.json({ con: false, data: error, msg: `Fail`, status: 305 }));
      })
      .catch((err) => {res.json({ con: false, data: err, msg: `Fail`, status: 305 })});
  })

  router.put("/superuser/user", (req, res) => { // UPDATE USER
    let obj = {
      phone: req.body.phone,
      email: req.body.email,
      role: req.body.role,
      name: req.body.name,
      userName: req.body.userName,
      user_id: req.body.user_id,
      password: null,
      login: false,
    };
    User.update(obj)
      .then((ree) => {
        const encryptedData = encrypt(JSON.stringify(ree));
        res.json({
          con: true,
          data: encryptedData,
          msg: `Success`,
        });
      })
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Fail` })
      );
  });

  router.delete("/superuser/user", (req, res) => { // DELETE USER
    let id = req.body.user_id;
    User.destory(id)
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({ con: true, data: encryptedData, msg: "Success" });
      })
      .catch((err) =>
        res.json({ con: false, data: err, msg: `Fail` })
      );
  });

  router.get("/superuser/user/:id", (req, res) => { // FIND USER
    let id = req.params('id');
    User.find(id)
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({ con: true, data: encryptedData, msg: "Success" });
      })
      .catch((err) =>
        res.json({ con: false, data: err, msg: `Fail` })
      );
  });

  // ****** USER ******* //

  // ****** POST ******* //

  router.get("/superuser/post", (req, res) => { // ALL POST
    Post.all()
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({
          con: true,
          data: encryptedData,
          msg: "Success",
          status: 200,
          length: result.length,
        });
      })
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Fail`, status: 304 })
      );
  });

  router.post("/superuser/post", (req, res) => { // CREATE POST
    let obj = {
      title: req.body.title,
      imgurl: req.body.imgurl,
      url: req.body.url,
    };
    Post.save(obj)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  })

  router.put("/superuser/post", (req, res) => { // UPDATE POST
    let obj = {
      title: req.body.title,
      imgurl: req.body.imgurl,
      url: req.body.url,
      post_id: req.body.post_id
    };
    Post.update(obj)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  })

  router.delete("/superuser/post", (req, res) => { // DELETE POST
    let id = req.body.post_id;
    Post.destory(id)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  })

  router.get("/superuser/post/:start/:count", (req, res) => {
    let start = parseInt(req.params.start, 10);
    let count = parseInt(req.params.count, 10);
    Post.paginate(start, count)
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({
          con: true,
          data: encryptedData,
          msg: "Success",
          status: 200,
          length: result,
        });
      })
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Fail`, status: 304 })
      );
  });

  // ****** POST ******* //

  // ****** SYSTEM ******* //

  router.get("/superuser/system", (req, res) => { // ALL SYSTEM
    System.all()
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({
          con: true,
          data: encryptedData,
          msg: "Success",
          status: 200,
          length: result.length,
        });
      })
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Fail`, status: 304 })
      );
  });

  router.post("/superuser/system", (req, res) => { // CREATE SYSTEM
    let obj = {
      name: req.body.name,
      logo: req.body.logo,
    };
    System.save(obj)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  })

  router.put("/superuser/system", (req, res) => { // UPDATE SYSTEM
    let obj = {
      name: req.body.name,
      logo: req.body.logo,
    };
    System.update(obj)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  })

  router.delete("/superuser/system", (req, res) => { // DELETE SYSTEM
    let id = req.body.system_id;
    System.destory(id)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  }) 

  // ****** SYSTEM ******* //

  // ****** SOCIAL ******* //

  router.get("/superuser/social", (req, res) => { // ALL SOCIAL
    Social.all()
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({
          con: true,
          data: encryptedData,
          msg: "Success",
          status: 200,
          length: result.length,
        });
      })
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Fail`, status: 304 })
      );
  });

  router.post("/superuser/social", (req, res) => { // CREATE SOCIAL
    let obj = {
      icon: req.body.icon,
      url: req.body.url,
    };
    Social.save(obj)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  })

  router.put("/superuser/social", (req, res) => { // UPDATE SOCIAL
    let obj = {
      icon: req.body.icon,
      url: req.body.url,
    };
    Social.update(obj)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  })

  router.delete("/superuser/social", (req, res) => { // DELETE SOCIAL
    let id = req.body.social_id;
    Social.destory(id)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  }) 

  // ****** SOCIAL ******* //

  // ****** TRANSACTION ******* //

  router.get("/superuser/transaction", (req, res) => { // ALL TRANSACTION
    Transaction.all()
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({
          con: true,
          data: encryptedData,
          msg: "Success",
          status: 200,
          length: result.length,
        });
      })
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Fail`, status: 304 })
      );
  });

  router.post("/superuser/transaction", (req, res) => { // CREATE TRANSACTION
    let obj = {
      user_id: req.body.user_id,
      balance: req.body.balance,
      type: req.body.type,
    };
    Transaction.save(obj)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  })

  router.put("/superuser/transaction", (req, res) => { // UPDATE TRANSACTION
    let obj = {
      user_id: req.body.user_id,
      balance: req.body.balance,
      type: req.body.type,
    };
    Transaction.update(obj)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  })

  router.delete("/superuser/transaction", (req, res) => { // DELETE TRANSACTION
    let id = req.body.transaction_id;
    Transaction.destory(id)
    .then((result) => {
      const encryptedData = encrypt(JSON.stringify(result));
      res.json({
        con: true,
        data: encryptedData,
        msg: "Success",
        status: 200
      });
    })
    .catch((error) =>
      res.json({ con: false, data: error, msg: `Fail`, status: 304 })
    );
  }) 

  // ****** TRANSACTION ******* //

  // ****** ADS ******* //

    router.get("/superuser/ads", (req, res) => { // ALL ADS
      Ads.all()
        .then((result) => {
          const encryptedData = encrypt(JSON.stringify(result));
          res.json({
            con: true,
            data: encryptedData,
            msg: "Success",
            status: 200,
            length: result.length,
          });
        })
        .catch((error) =>
          res.json({ con: false, data: error, msg: `Fail`, status: 304 })
        );
    });
  
    router.post("/superuser/ads", (req, res) => { // CREATE ADS
      let obj = {
        user_id: req.body.user_id,
        balance: req.body.balance,
        type: req.body.type,
      };
      Transaction.save(obj)
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({
          con: true,
          data: encryptedData,
          msg: "Success",
          status: 200
        });
      })
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Fail`, status: 304 })
      );
    })
  
    router.put("/superuser/transaction", (req, res) => { // UPDATE ADS
      let obj = {
        user_id: req.body.user_id,
        balance: req.body.balance,
        type: req.body.type,
      };
      Transaction.update(obj)
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({
          con: true,
          data: encryptedData,
          msg: "Success",
          status: 200
        });
      })
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Fail`, status: 304 })
      );
    })
  
    router.delete("/superuser/transaction", (req, res) => { // DELETE ADS
      let id = req.body.transaction_id;
      Transaction.destory(id)
      .then((result) => {
        const encryptedData = encrypt(JSON.stringify(result));
        res.json({
          con: true,
          data: encryptedData,
          msg: "Success",
          status: 200
        });
      })
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Fail`, status: 304 })
      );
    }) 
  // ****** ADS ******* //

  return router;
};
