var express = require("express"),
    app = express(),
    Entry = require("./db").Entry,
	_ = require("underscore"),
	moment = require("moment"),
	money_math = require("money-math");

process.chdir(__dirname);

app.set("view engine", "ejs");
app.use(require('skipper')());

function formatMoney(m)
{
	sign = (m<0?"-":"");
	return sign+money_math.floatToAmount(Math.abs(m));
}

app.post("/create", function(req,res)
{
	req.body.amount = Math.abs(req.param("amount"))*(req.param("action")=="withdraw"?-1:1);
	
	var newEntry = new Entry(req.body);
	newEntry.save(function(err, entry)
	{
		res.redirect("/");
	});
});

app.get("/delete/:id", function(req,res)
{
	if ( req.param("id") )
	{
		Entry.findById(req.param("id"), function(err, entry)
		{
			if ( !err && entry && entry.id != undefined )
			{
				var redirectTo = moment(entry.createdAt).format("MMMM YYYY");
				entry.remove(function(err)
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
	Entry.find(function(err, entries)
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
app.listen(require("./config").port);
