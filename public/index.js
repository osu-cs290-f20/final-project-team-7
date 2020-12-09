// var heroCard = Handlebars.templates.heroCard;
// var villainCard = Handlebars.templates.villainCard;

var heroCardHand = document.getElementsByClassName('hero-card');
var villainCardHand = document.getElementsByClassName('villain-card');
var selectedVillainSpot = document.getElementById('villain-card-spot');
var selectedHeroSpot = document.getElementById('hero-card-spot');

console.log(villainCardHand);
for (var i = 0; i < heroCardHand.length; i++)   {
    heroCardHand[i].addEventListener('click', selectHeroListener);
}

function selectHeroListener(event)  {
    console.log("hero card clicked")
    var selectedHeroCard = event.currentTarget;

    if (selectedHeroSpot.childElementCount == 0) {
        selectedHeroSpot.appendChild(selectedHeroCard);
    }
   else {
       console.log(selectedHeroSpot.children[0])
       selectedHeroSpot.children[0] = selectedHeroCard;
   }
}

for (var i = 0; i < villainCardHand.length; i++)    {
    villainCardHand[i].addEventListener('click', selectVillainListener);
}

function selectVillainListener(event)   {
    console.log("villain card clicked")
    
    var selectedVillainCard = event.currentTarget;

    selectedVillainSpot.firstChild = event.currentTarget;

    if (selectedVillainSpot.childElementCount == 0) {
        selectedVillainSpot.appendChild(selectedVillainCard);
    }
   else {
       console.log(selectedVillainSpot.children[0])
       selectedVillainSpot.children[0] = selectedVillainCard;
   }
}