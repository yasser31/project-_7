(function () {
    $(".spinner-border").hide();
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function (e) {
            $(".spinner-border").show();
            $.get('/search/', { query: $('.message_input').val() }, function initMap(data) {
                $(".spinner-border").hide();
                // The map
                var location = data.location
                var map = new google.maps.Map(
                    document.getElementById('map'), { zoom: 4, center: location });
                // The marker
                var marker = new google.maps.Marker({ position: location, map: map });
                addressResponse = ["Bien-sur mont petit ! la voici !", "Et vous voila servi",
                    " À votre service capitaine", " Quoi de plus facile",
                    "La voici, besoin d'autre chose",
                    " Tu sais, les adresses moi, ça me connait",
                    " Bien-sur, si tu veux que je te donne l'adresse de celui à qui tu doit de l'argent, je peut le faire mais entre nous ;)"]
                var random = Math.floor(Math.random() * addressResponse.length);
                setTimeout(function () {
                    sendMessage(addressResponse[random]);
                    sendMessage(data.address);
                }, 3000);
            });
            $.get("/wiki/", { query: $('.message_input').val() }, function (data) {
                var wikiResponse = ["Petit avec moi y'a toujours une petite hisoire quelque part, en voila une",
                    "En plus de l'adresse je raconte une histoire interessante regarde en bas ",
                    "Je suis en bonne humeur aujourd'hui je rajoute une histoire à l'adresse",
                    "GrandPy et les histoires j'en ai par centaine, en voila une regarde en bas",
                    "Je ne peut pas ne pas raconter une histoire sur ça"]
                var random = Math.floor(Math.random() * wikiResponse.length);
                setTimeout(function () {
                    sendMessage(wikiResponse[random]);
                    var wiki = data.wiki
                    $("#wiki").text(wiki);
                }, 3000);

            });

            return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText());
            }
        });

    });
}.call(this));