var Sequelize = require("sequelize"),
    db = new Sequelize("postgres://node:password@localhost/finance"),
    bcrypt = require("bcrypt");

exports.Entry = db.define("Entry", {
  title:{type:Sequelize.STRING, allowNull:false},
  amount:{type:Sequelize.FLOAT, allowNull:false},
  comment:{type:Sequelize.STRING, allowNull:false},
  category:{type:Sequelize.STRING, allowNull:false},
  createdAt:{type:Sequelize.DATE, allowNull:false, defaultValue: Sequelize.NOW}
});

exports.User = db.define("User", {
  username:{type:String, allowNull: false},
  password:{type:String, allowNull: false}
}, {
  hooks:
  {
    beforeCreate: function(obj, cb)
    {
      bcrypt.hash(obj.password, 8, function(err, hash)
      {
          obj.password = hash;
          cb(err, obj);
      });
    }
  },
  instanceMethods: {
    authenticate: function(pass, cb)
    {
      bcrypt.compare(this.password, pass, cb);
    }
  }
})
