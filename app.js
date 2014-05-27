var express = require("express"),
  app = express(),
  Entry = require("./db").Entry,
  _ = require("underscore"),
  moment = require("moment"),
  money_math = require("money-math"),
  passport = require("passport"),
  LocalStrategy = require('passport-local').Strategy;;

process.chdir(__dirname);

app.set("view engine", "ejs");
app.use(require('skipper')());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    done(null, true);
  }
));

passport.serializeUser(function(user, done) {
  done(null, true);
});

passport.deserializeUser(function(id, done) {
  done(null, true);
});

app.post("/login", passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));
app.get("/login", function (req, res)
{
  res.render("login");
});

function formatMoney(m)
{
	sign = (m<0?"-":"");
	return sign+money_math.floatToAmount(Math.abs(m));
}

app.post("/create", function(req,res)
{
	req.body.amount = Math.abs(req.param("amount"))*(req.param("action")=="withdraw"?-1:1);

	var newEntry = Entry.create(req.body).success(function()
	{
		res.redirect("/");
	});
});

app.get("/delete/:id", function(req,res)
{
	if ( req.param("id") )
	{
		Entry.find({id:req.param("id")}).success(function(entry)
		{
			if ( entry && entry.id != undefined )
			{
				var redirectTo = moment(entry.createdAt).format("MMMM YYYY");
				Entry.destroy({id:req.param("id")}).success(function()
				{
					res.redirect("/"+redirectTo);
				});
			}
		});
	}
	else res.redirect("/");
});

function index(req,res)
{
	Entry.all().success(function(entries)
	{
		 var total = 0;
		 _.each(entries, function(entry)
		 {
			 total += entry.amount;
		 });

		 requestedMonth = (req.param("month")?req.param("month"):moment().format("MMMM YYYY"));
		 res.render("index", {
			 _: _,
			 entries: entries,
			 total: total,
			 format: formatMoney,
			 moment:moment,
			 requestedMonth: requestedMonth,
			 isCurrentMonth: requestedMonth==moment().format("MMMM YYYY")
		 });
	 });
}

app.get("/:month", index);
app.get("/", index);

app.use(express.static("assets"));
app.listen(process.env.PORT||8080);
