
var heroCardTemplate = Handlebars.templates.heroCard;
// var villainCardTemplate = Handlebars.templates.villainCard;

var heroCardHand = document.getElementsByClassName('hero-card');
var villainCardHand = document.getElementsByClassName('villain-card');
var selectedVillainSpot = document.getElementById('villain-card-spot');
var selectedHeroSpot = document.getElementById('hero-card-spot');
var playCardButton = document.getElementById('start-turn-button');



for (var i = 0; i < heroCardHand.length; i++)   {
    heroCardHand[i].addEventListener('click', selectHeroListener);
}

function selectHeroListener(event)  {
    var selectedHeroCard = event.currentTarget;

    if (selectedHeroSpot.childElementCount == 0) {
        selectedHeroSpot.appendChild(selectedHeroCard);
    }
   else {
       selectedHeroSpot.children[0] = selectedHeroCard;
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
       selectedVillainSpot.children[0] = selectedVillainCard;
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
                    winMessage = "You won!";
                }
                else    {
                    winMessage = "You lost!";
                }

                var heroDiceContainer = document.querySelector(".hero-data-boxes .dice-roll");
                var villainDiceContainer = document.querySelector(".villain-data-boxes .dice-roll");
                var heroAttackContainer = document.querySelector(".hero-data-boxes .attack-total");
                var villainAttackContainer = document.querySelector(".villain-data-boxes .attack-total");
                var finalTotalContainer = document.getElementsByClassName("final-total");

                var heroDice = document.createTextNode(responseBody.hero.dice);
                var heroAttack = document.createTextNode(responseBody.hero.attack);           
                var heroTotal = document.createTextNode(responseBody.hero.total);

                var villainDice = document.createTextNode(responseBody.villain.dice);
                var villainAttack = document.createTextNode(responseBody.villain.attack);
                var villainTotal = document.createTextNode(responseBody.villain.total);
    

                heroDiceContainer.appendChild(heroDice);
                heroAttackContainer.appendChild(heroAttack);
                finalTotalContainer[1].appendChild(heroTotal);

                villainDiceContainer.appendChild(villainDice);
                villainAttackContainer.appendChild(villainAttack);
                finalTotalContainer[0].appendChild(villainTotal);

                alert(winMessage);
            }
            else    {
                alert("Error sending play request");
            }
        });

        playPostRequest.send(reqBody);
    }
}
