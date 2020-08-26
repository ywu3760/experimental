function init() {
    var inputElement = $("<input>").attr({
        "id": "welcomeInput",
        "type": "text",
        "placeholder": "first-name",
        "value": "",
        "spellcheck": "false",
        "autocomplete": "off"
    });
    $("body").append($("<div>")
        .attr("class", "welcome-container")
        .append($("<div>")
            .attr("class", "welcome-text")
            .html(`Today is ${inputElement.prop("outerHTML")}\'s birthday!`)
        )
        .append($("<div>")
            .attr("class", "welcome-button")
            .html(`continue &#8629;`)
        )
    );
    var welcomeInput = document.getElementById("welcomeInput");
    welcomeInput.style.width = welcomeInput.value.length + "ch";
    welcomeInput.addEventListener('input', checkInput);
}

function checkInput(e) {
    var welcomeInput = document.getElementById("welcomeInput");
    if (GLOBALS.state == 1) welcomeInput = document.getElementById("welcomeInput2");
    switch (GLOBALS.state) {
        case 0:
            if (welcomeInput.value.length == 0) welcomeInput.style.minWidth = "10ch";
            else welcomeInput.style.minWidth = welcomeInput.value.length + "ch";
            break;
        case 1:
            if (welcomeInput.value.length == 0) welcomeInput.style.minWidth = "4ch";
            else welcomeInput.style.minWidth = welcomeInput.value.length + "ch";
            break;
    }
    welcomeInput.style.width = welcomeInput.value.length + "ch";
    if (welcomeInput.value.length > 0 && !GLOBALS.welcomeEnterDisplayed) {
        GLOBALS.welcomeEnterDisplayed = true;
        setTimeout(function() {
            $(".welcome-button").css("visibility", "visible").animate({
                "opacity": "1"
            }, 250, function() {
                GLOBALS.enterKeyAnimInProg = false;
                $(".welcome-button").attr("onclick", "nextState()");
                window.addEventListener("keypress", function welcomeKeyPress(e) {
                    if (!(e.code === "Enter") || GLOBALS.enterKeyAnimInProg) return;
                    if ([0, 1].includes(GLOBALS.state)) {
                        switch (GLOBALS.state) {
                            case 0:
                                var input = document.getElementById("welcomeInput").value;
                                if (input.trim().length != 0) nextState();
                                else return alert("Please give me a valid name.");
                                break;
                            case 1:
                                var input = document.getElementById("welcomeInput2").value;
                                if (input.trim().length == 0) return alert("Please give me a valid year.");;
                                if (isNaN(input.trim())) return alert("Years only have numbers.");
                                if (!Number.isInteger(parseInt(input.trim()))) return alert("Please give me a valid year.");
                                if (parseInt(input.trim()) < 1900 || parseInt(input.trim()) > (new Date().getFullYear())) return alert("Please give me a valid year.");

                                window.removeEventListener("keypress", welcomeKeyPress);
                                nextState();
                                break;
                        }
                    } else window.removeEventListener("keypress", welcomeKeyPress);
                });
            });
        }, 200);
    }
}

function nextState() {
    switch (GLOBALS.state) {
        case 0:
            GLOBALS.enterKeyAnimInProg = true;
            GLOBALS.name = document.getElementById("welcomeInput").value.trim();
            $(".welcome-text").html(`Today is ${GLOBALS.name}'s birthday!`).delay(250).animate({
                "opacity": "0"
            }, 500, function() {
                var inputElement = $("<input>").attr({
                    "id": "welcomeInput2",
                    "type": "text",
                    "placeholder": "year",
                    "value": "",
                    "spellcheck": "false",
                    "autocomplete": "off",
                    "maxlength": "4"
                });
                $(".welcome-text").html(`${GLOBALS.name} was born in ${inputElement.prop("outerHTML")}!`);
                var welcomeInput = document.getElementById("welcomeInput2");
                welcomeInput.style.width = welcomeInput.value.length + "ch";
                welcomeInput.addEventListener('input', checkInput);
            }).animate({
                "opacity": "1"
            }, 500, function() {
                GLOBALS.enterKeyAnimInProg = false;
            });
            break;
        case 1:
            GLOBALS.enterKeyAnimInProg = true;
            GLOBALS.year = parseInt(document.getElementById("welcomeInput2").value.trim());
            $(".welcome-text").html(`${GLOBALS.name} was born in ${GLOBALS.year}!`);
            $(".welcome-button").removeAttr("onclick").animate({
                "font-size": "0px",
                "margin-top": "0px",
                "padding": "0px",
                "opacity": "0"
            }, 1000, function() {
                $(".welcome-button").remove();
                $(".welcome-text").animate({
                    "opacity": "0"
                }, 500, function() {
                    $(".welcome-text").html(`Loading ${GLOBALS.name}'s birthday present...`);
                }).animate({
                    "opacity": "1"
                }, 500, function() {
                    addLoading("body", 50);
                    window.addEventListener("resize", function() {
                        $(".loading-container").css("height", $(".loading-container").width());
                    });
                    setTimeout(function() {
                        // get age
                        var calcAge = function(birthDate) {
                            var today = new Date(),
                                birthDate = new Date(birthDate),
                                age = today.getFullYear() - birthDate.getFullYear(),
                                m = today.getMonth() - birthDate.getMonth();
                            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                            return age;
                        };
                        GLOBALS.age = calcAge(new Date(GLOBALS.year, GLOBALS.month, GLOBALS.day));

                        // get zodiac
                        var month = `${GLOBALS.month + 1}`, day = `${GLOBALS.day}`;
                        if (month.length < 2) month = "0" + month;
                        if (day.length < 2) day = "0" + day;
                        var settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": `https://zodiac-sign.p.rapidapi.com/sign?date=${GLOBALS.year}-${month}-${day}`,
                            "method": "GET",
                            "headers": {
                                "x-rapidapi-host": "zodiac-sign.p.rapidapi.com",
                                "x-rapidapi-key": "049dfcba0amsh48bf6c8001562aep1e4236jsn20b144a6fe05"
                            }
                        };
                        $.ajax(settings).done(function (response) {
                            GLOBALS.zodiac = response;
                            var settings = {
                                "async": true,
                                "crossDomain": true,
                                "url": "https://type.fit/api/quotes",
                                "method": "GET"
                            }
                            $.ajax(settings).done(function (response) {
                                response = JSON.parse(response);
                                var randIdx = randNum(0, response.length, 0);
                                GLOBALS.quote = [response[randIdx].text, response[randIdx].author];

                                endLoading(0);
                            });
                        });
                    }, 1500 + GLOBALS.additionalTime);
                });
            });
            break;
        case 2:
            $("body").append($("<div>")
                .attr("id", "overlayState2")
                .css({
                    "width": `${(Math.sqrt((window.innerHeight**2) + (window.innerWidth)**2))}px`,
                    "height": `${(Math.sqrt((window.innerHeight**2) + (window.innerWidth)**2))}px`,
                    "position": "fixed",
                    "transform": "translate(-50%, -50%)",
                    "top": "50%",
                    "left": "50%",
                    "z-index": "3",
                    "background-color": "#000000",
                    "border-radius": "50% 50%"
                })
                .html("lOLLLL")
            );
            console.log(document.getElementById("overlayState2").innerHTML);
            $("body").css({
                "transition": "none",
                "background-color": "#F1E8D9",
                "text-align": "center",
                "background-image": 'url("assets/confetti_background.png")',
                "background-position": "center center",
                "background-size": "cover",
                "background-attachment": "fixed"
            });
            document.querySelector("body").innerHTML+= `
            <div class="result-cheers">
                <p>Happy Birthday,</p>
                <p><span id="resultName"></span>!</p>
            </div>
            <div class="result-age">
                <p>🎉 You are now <span id="resultAge"></span> years old! 🎉</p>
            </div>
            <div class="result-explain">
                <p>Since I'm just a bot, I <span>cannot</span> give you a <span>physical</span> birthday present to celebrate this important event. 😢</p>
                <p><span>However</span>, with the <span>power</span> of APIs and JSON files, I will present to you a very unique <span>present</span>! 😆</p>
            </div>
            <div class="result-zodiac">
                <p>Since your birthday is on the <span id="resultDay"></span> of <span id="resultMonth"></span>, you fall in the Zodiac range of <span id="resultRange"></span>. Therefore, you are <span id="resultZodiac"></span>! <span id="resultEmoji"></span></p>
            </div>
            <div class="result-qualities">
                <p>Since you are <span id="resultZodiac2"></span> <span id="resultEmoji2"></span>, my present to you will be reminding you of all the <span>good</span> qualities that makes who you are today!</p>
                <p>You are <span id="resultStrength"></span>!</p>
                <p>Your favorite activities:<br><span id="resultActivity"></span></p>
            </div>
            <div class="result-number">
                <p>If you ever need a <span>lucky</span> number, these are some lucky numbers <span>related</span> to your zodiac!</p>
                <div class="result-number-box">
                </div>
            </div>
            <div class="result-speech">
                <p>If you ever need a <span>motivational</span> statement to move forward, here is one!</p>
                <p id="resultSpeech"></p>
            </div>
            <div class="result-cake">
                <div>
                    <img src="assets/cake_slice.png" alt="cake slice">
                    <span id="resultAge2"></span>
                </div>
                <p>Happy Birthday!</p>
            </div>
            <footer class="result-footer">
                <p>Brought to you by Yangfa Wu 2020.</p>
                <p>😆 Creating alternatives to traditional birthday presents. 😆</p>
            </footer>
            `;
            addUserInfo();
            setTimeout(function() {
                $("#overlayState2").animate({
                    "width": "0px",
                    "height": "0px"
                }, 500, function() {
                    console.log("hi");
                    $("#overlayState2").remove();
                });
            }, 100);
            break;
    }
    GLOBALS.state++;
}

function addUserInfo() {
    $("#resultName").html(GLOBALS.name);
    $("#resultAge").html(GLOBALS.age);
    $("#resultDay").html(GLOBALS.day);

    switch (GLOBALS.month) {
        case 0:
            $("#resultMonth").html("January");
            break;
        case 1:
            $("#resultMonth").html("February");
            break;
        case 2:
            $("#resultMonth").html("March");
            break;
        case 3:
            $("#resultMonth").html("April");
            break;
        case 4:
            $("#resultMonth").html("May");
            break;
        case 5:
            $("#resultMonth").html("June");
            break;
        case 6:
            $("#resultMonth").html("July");
            break;
        case 7:
            $("#resultMonth").html("August");
            break;
        case 8:
            $("#resultMonth").html("September");
            break;
        case 9:
            $("#resultMonth").html("October");
            break;
        case 10:
            $("#resultMonth").html("November");
            break;
        case 11:
            $("#resultMonth").html("December");
            break;
    }
    var zodiac = GLOBALS.zodiac.toLowerCase();
    $("#resultRange").html(GLOBALS.info[zodiac].range);
    $("#resultEmoji").html(GLOBALS.info[zodiac].emoji);
    $("#resultEmoji2").html(GLOBALS.info[zodiac].emoji);

    var zodiacOut = zodiac.charAt(0).toUpperCase() + zodiac.substr(1);
    if ("AEIOU".split("").includes(zodiacOut.charAt(0))) zodiacOut = "an " + zodiacOut;
    else zodiacOut = "a " + zodiacOut;
    $("#resultZodiac").html(zodiacOut);
    $("#resultZodiac2").html(zodiacOut);
    
    setTimeout(function strengthLooper() {
        var zodiac = GLOBALS.zodiac.toLowerCase(),
            strengths = GLOBALS.info[zodiac].strengths.split(", ");
        $("#resultStrength").html(strengths[GLOBALS.strengthIndex]);
        GLOBALS.strengthIndex++;
        if (GLOBALS.strengthIndex == strengths.length) GLOBALS.strengthIndex = 0;
        setTimeout(strengthLooper, randNum(1500, 2000, 0));
    }, 0);
    setTimeout(function activityLooper() {
        var zodiac = GLOBALS.zodiac.toLowerCase(),
            activities = GLOBALS.info[zodiac].activities.split(", ");
        $("#resultActivity").html(activities[GLOBALS.activityIndex]);
        GLOBALS.activityIndex++;
        if (GLOBALS.activityIndex == activities.length) GLOBALS.activityIndex = 0;
        setTimeout(activityLooper, randNum(1500, 2000, 0));
    }, 0);

    var luckyNums = GLOBALS.info[zodiac].numbers.split(", ");
    $(".result-number-box").empty();
    for (var i=0; i<luckyNums.length; i++) $(".result-number-box").append($("<div>")
        .html(luckyNums[i])
    );

    $("#resultAge2").html(GLOBALS.age);
    if (randNum(0, 1, 1) == 0) $("#resultSpeech").html(GLOBALS.info[zodiac].cheer1);
    else $("#resultSpeech").html(GLOBALS.info[zodiac].cheer2);
}

function randNum(t,r,n) {return Math.floor(Math.random()*(r-t+n))+t}

function generateRandomId(length) {
    var pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i=0, id=""; i<length; i++) id+= pool.charAt(randNum(0, pool.length, 0));
    return id;
}

function addLoading(parent, ratio) {
    var customId = generateRandomId(128);
    $(`${parent}`).append($("<div>")
        .attr({
            "id": customId,
            "class": "loading-container"
        })
        .css({
            "width": `0%`,
            "height": `0px`
        })
        .data("animationEnded", false)
        .animate({
            "width": `${ratio}%`,
            "height": `${0.01*ratio*($(`${parent}`).width())}px`
        }, 500, function() {
            for (var i=9; i>=0; i--) {
                if ($(".loading-container").width() != $(".loading-container").height()) $(".loading-container").css("height", $(".loading-container").width());
                var anim = function(customId, i, angle, direction) {
                    if ($(`#${customId}`).data("animationEnded")) return $(`#${customId + i}`).css({
                        "transform": "translate(-50%, -50%) rotate(0deg)",
                        "z-index": `${-i}`
                    }).animate({
                        "width": `${9*(i+1)}%`,
                        "height": `${9*(i+1)}%`
                    }, 1000).animate({
                        "width": `0%`,
                        "height": `0%`
                    }, 500);
                    if ($(".loading-container").width() != $(".loading-container").height()) $(".loading-container").css("height", $(".loading-container").width());
                    var randomSize = randNum(0, 100, 0),
                        newAngle = angle + direction*randNum(30, 50, 1);
                    if (randomSize <= 25) $(`#${customId + i}`).css({
                        "background-color": `rgb(${randNum(150, 200, 0)}, ${randNum(150, 200, 0)}, ${randNum(150, 200, 0)})`,
                        "z-index": randNum(0, 9, 0)
                    });
                    $(`#${customId + i}`).css("transform", `translate(-50%, -50%) rotateZ(${newAngle}deg)`).animate({
                        "width": `${randomSize}%`,
                        "height": `${randomSize}%`
                    }, 500, function () {
                        if (!$(`#${customId}`).data("animationEnded")) anim(customId, i, newAngle, direction);
                        else {
                            $(`#${customId + i}`).css({
                                "transform": "translate(-50%, -50%) rotate(0deg)",
                                "z-index": `${-i}`
                            }).animate({
                                "width": `${9*(i+1)}%`,
                                "height": `${9*(i+1)}%`
                            }, 1000).animate({
                                "width": `0%`,
                                "height": `0%`
                            }, 500);
                        }
                    });
                }
                $(`#${customId}`).append($("<div>")
                    .attr({
                        "id": (customId + i),
                        "class": "loading-container-child"
                    })
                    .css({
                        "width": "0%",
                        "height": "0%",
                        "background-color": `rgb(${randNum(150, 200, 0)}, ${randNum(150, 200, 0)}, ${randNum(150, 200, 0)})`
                    }).animate({
                        "width": `${9*(i+1)}%`,
                        "height": `${9*(i+1)}%`
                    }, 1000)
                );
                setTimeout(anim, 1500, customId, i, 0, ([-1, 1][randNum(0, 2, 0)]));
            }
        })
    );
    
    GLOBALS.loading.push(customId);

    return GLOBALS.loading.indexOf(customId);
}

function endLoading(idx) {
    $(`#${GLOBALS.loading[idx]}`).data("animationEnded", true);
    setTimeout(function(idx) {
        switch (idx) {
            case 0:
                $("body").css({
                    "transition": "background-color 0.5s",
                    "background-color": "#000000",
                    "overflow-y": "visible"
                });
                $(".welcome-container").remove();
                setTimeout(function() {
                    nextState();
                }, 1000);
                break;
        }
        $(`#${GLOBALS.loading[idx]}`).remove();
    }, 2000, idx);
}