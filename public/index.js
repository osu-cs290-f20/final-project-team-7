
// Handlebars.templates.heroCard;
// var villainCardTemplate = Handlebars.templates.villainCard;

var heroCardHand = document.getElementsByClassName('hero-card');
var villainCardHand = document.getElementsByClassName('villain-card');

var selectedVillainSpot = document.getElementById('villain-card-spot');
var selectedHeroSpot = document.getElementById('hero-card-spot');

var playCardButton = document.getElementById('start-turn-button');

var heroCardOptionsContainer = document.getElementById('hero-card-options');
var villainCardOptionsContainer = document.getElementById('villain-card-options');
var heroDiceContainer = document.querySelector(".hero-data-boxes .dice-roll");
var villainDiceContainer = document.querySelector(".villain-data-boxes .dice-roll");
var heroAttackContainer = document.querySelector(".hero-data-boxes .attack-total");
var villainAttackContainer = document.querySelector(".villain-data-boxes .attack-total");
var finalTotalContainer = document.getElementsByClassName("final-total");
var scoreCounterContainer = document.getElementById("score-total");
var pointsCounterContainer = document.getElementById('point-total');

var levelOneHeroButton = document.getElementById('level-1-hero-button');
var levelTwoHeroButton = document.getElementById('level-2-hero-button');

for (var i = 0; i < heroCardHand.length; i++)   {
    heroCardHand[i].addEventListener('click', selectHeroListener);
}

function selectHeroListener(event)  {
    var selectedHeroCard = event.currentTarget;

    if (selectedHeroSpot.childElementCount == 0) {
        selectedHeroSpot.appendChild(selectedHeroCard);
    }
   else {
       heroCardOptionsContainer.appendChild(selectedHeroSpot.children[0]);
       selectedHeroSpot.appendChild(selectedHeroCard);
   }
}



for (var i = 0; i < villainCardHand.length; i++)    {
    villainCardHand[i].addEventListener('click', selectVillainListener);
}

function selectVillainListener(event)   {    
    var selectedVillainCard = event.currentTarget;
    selectedVillainSpot.firstChild = event.currentTarget;

    if (selectedVillainSpot.childElementCount == 0) {
        selectedVillainSpot.appendChild(selectedVillainCard);
    }
   else {
       villainCardOptionsContainer.appendChild(selectedVillainSpot.children[0]);
       selectedVillainSpot.appendChild(selectedVillainCard);
   }
}


function updateCardHand (cardResponse)  {
    while (heroCardOptionsContainer.firstChild) {
        heroCardOptionsContainer.removeChild(heroCardOptionsContainer.firstChild);
    }
    while (villainCardOptionsContainer.firstChild)  {
        villainCardOptionsContainer.removeChild(villainCardOptionsContainer.firstChild);
    }

    var newHeroCards = cardResponse.heroes;

    for (var i = 0; i < newHeroCards.length; i++)  {
        heroCardOptionsContainer.insertAdjacentHTML('beforeend', Handlebars.templates.heroCard(newHeroCards[i]));
    }

    var newVillainCards = cardResponse.villains;

    for (var i = 0; i < newVillainCards.length; i++)    {
        villainCardOptionsContainer.insertAdjacentHTML('beforeend', Handlebars.templates.villainCard(newVillainCards[i]));
    }



    heroCardHand = document.getElementsByClassName('hero-card');
    villainCardHand = document.getElementsByClassName('villain-card');  
    
    for (var i = 0; i < heroCardHand.length; i++)   {
        heroCardHand[i].addEventListener('click', selectHeroListener);
    }

    for (var i = 0; i < villainCardHand.length; i++)    {
        villainCardHand[i].addEventListener('click', selectVillainListener);
    }
}



playCardButton.addEventListener('click', playCardListener);

function playCardListener(event)    {
    if (selectedVillainSpot.childElementCount == 0 || selectedHeroSpot.childElementCount == 0)  {
        alert("Please select a Hero and a Villain card to play");
    }
    else    {
        var heroName = selectedHeroSpot.children[0].firstElementChild.dataset.name;
        var villainName = selectedVillainSpot.children[0].firstElementChild.dataset.name;

        var playPostRequest = new XMLHttpRequest();
        playPostRequest.open('POST', '/play');

        var reqBody = JSON.stringify({
            hero: heroName, 
            villain: villainName
        })

        playPostRequest.setRequestHeader('Content-type', 'application/json');
        playPostRequest.responseType = 'json'

        playPostRequest.addEventListener('load', function(event)    {
            if (event.target.status == 200) {
                var responseBody = playPostRequest.response;
                var winMessage;
                if (responseBody.win)   {
                    winMessage = "won";
                }
                else    {
                    winMessage = "lost";
                }
                if (responseBody.endgame) {
                    winMessage = "Game over; you " + winMessage + "! Press OK to play again.";
                } else {
                    winMessage = "You " + winMessage + "!";
                }
 
                alert(winMessage);

                heroDiceContainer.innerText = responseBody.hero.dice;
                heroAttackContainer.innerText = responseBody.hero.attack;
                finalTotalContainer[1].innerText = responseBody.hero.total;

                villainDiceContainer.innerText = responseBody.villain.dice;
                villainAttackContainer.innerText = responseBody.villain.attack;
                finalTotalContainer[0].innerText = responseBody.villain.total;

                pointsCounterContainer.innerText = responseBody.money;
                scoreCounterContainer.innerText = responseBody.score;

                selectedVillainSpot.removeChild(selectedVillainSpot.children[0]);
                selectedHeroSpot.removeChild(selectedHeroSpot.children[0]);

                updateCardHand(responseBody.cards);
            }
            else    {
                alert("Error sending play request");
            }
        });
        playPostRequest.send(reqBody);
    }
}

levelOneHeroButton.addEventListener('click', upgradeHeroButtonListener);
levelTwoHeroButton.addEventListener('click', upgradeHeroButtonListener);

function upgradeHeroButtonListener(event)  {
    upgradePostRequest = new XMLHttpRequest();

    var requestURL;

    if (event.currentTarget == levelOneHeroButton)  {
        requestURL = '/upgrade/1';
    }
    else if (event.currentTarget == levelTwoHeroButton) {
        requestURL = '/upgrade/2';
    }

    upgradePostRequest.open('POST', requestURL);
    upgradePostRequest.setRequestHeader('Content-type', 'application/json');
    upgradePostRequest.responseType = 'json'

    upgradePostRequest.addEventListener('load', function(event) {
        if (event.target.status == 200) {
            var responseBody = upgradePostRequest.response;

            pointsCounterContainer.innerText = responseBody.money;
            updateCardHand(responseBody.cards);
        }
        else   {
            alert("Cannot update hand")
        }
    });

    upgradePostRequest.send();
}
