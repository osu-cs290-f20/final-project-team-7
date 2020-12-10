// var heroCard = Handlebars.templates.heroCard;
// var villainCard = Handlebars.templates.villainCard;

var heroCardHand = document.getElementsByClassName('hero-card');
var villainCardHand = document.getElementsByClassName('villain-card');
var selectedVillainSpot = document.getElementById('villain-card-spot');
var selectedHeroSpot = document.getElementById('hero-card-spot');
var playCardButton = document.getElementById('start-turn-button');

console.log(villainCardHand);
for (var i = 0; i < heroCardHand.length; i++)   {
    heroCardHand[i].addEventListener('click', selectHeroListener);
}

function selectHeroListener(event)  {
    // console.log("hero card clicked")
    var selectedHeroCard = event.currentTarget;

    if (selectedHeroSpot.childElementCount == 0) {
        selectedHeroSpot.appendChild(selectedHeroCard);
    }
   else {
    //    console.log(selectedHeroSpot.children[0])
       selectedHeroSpot.children[0] = selectedHeroCard;
   }
}

for (var i = 0; i < villainCardHand.length; i++)    {
    villainCardHand[i].addEventListener('click', selectVillainListener);
}

function selectVillainListener(event)   {
    // console.log("villain card clicked")
    
    var selectedVillainCard = event.currentTarget;

    selectedVillainSpot.firstChild = event.currentTarget;

    if (selectedVillainSpot.childElementCount == 0) {
        selectedVillainSpot.appendChild(selectedVillainCard);
    }
   else {
    //    console.log(selectedVillainSpot.children[0])
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

        // playPostRequest.onreadystatechange = function() {
        //     if (playPostRequest.status == 200)  {
        //         var responseBody = playPostRequest.response;
        //         console.log(responseBody.win);
        //     }
        // }

        playPostRequest.addEventListener('load', function(event)    {

            var responseBody = playPostRequest.response;
            console.log(responseBody.win);
        });

        playPostRequest.send(reqBody);

        // console.log("Going to play these cards");
        // console.log(villainName);
        // console.log(heroName);
    }
}