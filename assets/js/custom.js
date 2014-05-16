$("#withdraw_button").click(function() { $("#withdraw").removeClass("hide"); $("#deposit").addClass("hide"); });
$("#deposit_button").click(function() { $("#withdraw").addClass("hide"); $("#deposit").removeClass("hide"); });

$(".delete").click(function()
{
  if ( confirm("Delete this entry?") )
  {
    window.location = "/delete/"+$(this).attr("id");
  }
});

renderCheckbook();

