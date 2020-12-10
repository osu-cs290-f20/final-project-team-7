
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

// heroDiceContainer.appendChild(" ");
// heroAttackContainer.appendChild(" ");
// finalTotalContainer[1].appendChild(" ");

// villainDiceContainer.appendChild(" ");
// villainAttackContainer.appendChild(" ");
// finalTotalContainer[0].appendChild(" ");



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


                heroDiceContainer.innerText = responseBody.hero.dice;
                heroAttackContainer.innerText = responseBody.hero.attack;
                finalTotalContainer[1].innerText = responseBody.hero.total;

                villainDiceContainer.innerText = responseBody.villain.dice;
                villainAttackContainer.innerText = responseBody.villain.attack;
                finalTotalContainer[0].innerText = responseBody.villain.total;


                while (heroCardOptionsContainer.firstChild) {
                    heroCardOptionsContainer.removeChild(heroCardOptionsContainer.firstChild);
                }
                while (villainCardOptionsContainer.firstChild)  {
                    villainCardOptionsContainer.removeChild(villainCardOptionsContainer.firstChild);
                }

                var newHeroCards = responseBody.cards.heroes;

                for (var i = 0; i < newHeroCards.length; i++)  {
                    heroCardOptionsContainer.insertAdjacentHTML('beforeend', Handlebars.templates.heroCard(newHeroCards[i]));
                }

                var newVillainCards = responseBody.cards.villains;

                for (var i = 0; i < newVillainCards.length; i++)    {
                    villainCardOptionsContainer.insertAdjacentHTML('beforeend', Handlebars.templates.villainCard(newVillainCards[i]));
                }

                selectedVillainSpot.removeChild(selectedVillainSpot.children[0]);
                selectedHeroSpot.removeChild(selectedHeroSpot.children[0]);

                heroCardHand = document.getElementsByClassName('hero-card');
                villainCardHand = document.getElementsByClassName('villain-card');  
                
                for (var i = 0; i < heroCardHand.length; i++)   {
                    heroCardHand[i].addEventListener('click', selectHeroListener);
                }

                for (var i = 0; i < villainCardHand.length; i++)    {
                    villainCardHand[i].addEventListener('click', selectVillainListener);
                }

                alert(winMessage);
            }
            else    {
                alert("Error sending play request");
            }
        });

        playPostRequest.send(reqBody);
    }
}
