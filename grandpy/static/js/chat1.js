$(document).ready(function () {
    $(".spinner-border").hide();
    function getMessage() {
        var message = $(".message_input").val();
        return message
    }

    function userMessage() {
        var element = `<li class="message left appeared ">
        <div class="avatar"><img src="../static/images/user.jpeg" alt="bot image"
        class="h-100 w-100 avatar_image"></div>
        <div class="text_wrapper">
            <div class="text"></div>
        </div>
        </li>`;
        $(".messages").append(element);

        $("ul li").last().children().eq(1).children().first().html(function () {
            return getMessage();
        });
    }

    function botMessage(message) {
        var element = `<li class="message right appeared ">
        <div class="avatar"><img src="../static/images/bot.jpg" alt="bot image"
        class="h-100 w-100 avatar_image"></div>
        <div class="text_wrapper">
            <div class=" text"></div>
        </div>
        </li>`;
        $(".messages").append(element);

        $("ul li").last().children().eq(1).children().first().html(function () {
            return message;
        });
    }

    $(".send_message").on("click", function () {
        userMessage();
        $(".spinner-border").show();
        $.get('/search/', { query: $('.message_input').val() }, function initMap(data) {
            $(".spinner-border").hide();
            if (data.error) {
                $("#map").empty();
                setTimeout(function(){
                    botMessage("Désolé je suis un peut perdu je ne trouve pas l'adresse");
                }, 2000);
                setTimeout(function(){
                    $("#map").append(`<img src="../static/images/error.png" alt="error image" class="h-100 w-100">`);
                }, 2000)
                
            }
            else {
                $("#map").empty();
                addressResponse = ["Bien-sur mont petit ! la voici !", "Et vous voila servi",
                    " À votre service capitaine !", " Quoi de plus facile",
                    "La voici, besoin d'autre chose ?",
                    " Tu sais, moi les adresses, ça me connait",
                    " Bien-sur, si tu veux que je te donne l'adresse de celui à qui tu dois de l'argent, je peut le faire mais entre nous ;)"]
                var random = Math.floor(Math.random() * addressResponse.length);
                setTimeout(function(){
                    botMessage(addressResponse[random]);
                }, 1000);
                setTimeout(function () {
                    botMessage(data.address);
                }, 2000);
                // The map
                var location = data.location
                var map = new google.maps.Map(
                    document.getElementById('map'), { zoom: 4, center: location });
                // The marker
                var marker = new google.maps.Marker({ position: location, map: map });
            }
        });
        $.get("/wiki/", { query: $('.message_input').val() }, function (data) {
            if (data.error) {
                $("#wiki").empty();
                setTimeout(function(){
                    botMessage("Désolé petit j'ai pas d'histoire cette foic-ci");
                }, 3000)
                
            }
            else {
                $("#wiki").empty();
                var wikiResponse = ["Petit, avec moi, y'a toujours une petite hisoire quelque part, en voila une",
                    "En plus de l'adresse, je te raconte une histoire interessante, regarde en bas ",
                    "Je suis en bonne humeur aujourd'hui, je rajoute une histoire à l'adresse",
                    "Ahhh ! GrandPy et les histoires, j'en ai par centaine, en voila une, regarde en bas",
                    "Je ne peut pas m'empécher de te raconter une histoire sur ça"]
                var random = Math.floor(Math.random() * wikiResponse.length);
                setTimeout(function () {
                    botMessage(wikiResponse[random]);
                }, 4000);
                var wiki = data.wiki
                setTimeout(function () {
                    $("#wiki").text(wiki);
                }, 4000);
            }
        });

    });
});

