$("#info").click(function() {
    if ($("#instructions").attr("class") === "down") {
        $("#instructions").slideUp();
        $("#instructions").removeClass("down");
    } else {
        $("#instructions").slideDown();
        $("#instructions").removeClass("d-none");
        $("#instructions").addClass("down");
    }
});