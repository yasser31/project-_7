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
        $('.send_message').on("click", function (e) {
            $(".spinner-border").show();
            $.get('/search/', { query: $('.message_input').val() }, function initMap(data) {
                $(".spinner-border").hide();
                if (data.error) {
                       $("#map").append(`<img src="../static/images/error.jpg" alt="error image" class="h-100 w-100">`);
                }
                else {
                    addressResponse = ["Bien-sur mont petit ! la voici !", "Et vous voila servi",
                        " À votre service capitaine !", " Quoi de plus facile",
                        "La voici, besoin d'autre chose ?",
                        " Tu sais, moi les adresses, ça me connait",
                        " Bien-sur, si tu veux que je te donne l'adresse de celui à qui tu dois de l'argent, je peut le faire mais entre nous ;)"]
                    var random = Math.floor(Math.random() * addressResponse.length);
                    sendMessage(addressResponse[random]);
                    setTimeout(function () {
                        sendMessage(data.address);
                    }, 3000);
                    // The map
                    var location = data.location
                    var map = new google.maps.Map(
                        document.getElementById('map'), { zoom: 4, center: location });
                    // The marker
                    var marker = new google.maps.Marker({ position: location, map: map });
                }
            });
            $.get("/wiki/", { query: $('.message_input').val() }, function (data) {
                if(data.error){
                    
                }
                
                else{
                    var wikiResponse = ["Petit, avec moi, y'a toujours une petite hisoire quelque part, en voila une",
                    "En plus de l'adresse, je te raconte une histoire interessante, regarde en bas ",
                    "Je suis en bonne humeur aujourd'hui, je rajoute une histoire à l'adresse",
                    "Ahhh ! GrandPy et les histoires, j'en ai par centaine, en voila une, regarde en bas",
                    "Je ne peut pas m'empécher de te raconter une histoire sur ça"]
                    var random = Math.floor(Math.random() * wikiResponse.length);
                    setTimeout(function () {
                        sendMessage(wikiResponse[random]);
                    }, 3000);
                    var wiki = data.wiki
                    setTimeout(function () {
                        $("#wiki").text(wiki);
                    }, 4000);
            }
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