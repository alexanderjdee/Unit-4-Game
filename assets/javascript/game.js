//OBJECTS
var kyloRen = {
    id: "kyloRen",
    name: "Kylo Ren",
    healthPoints: 120,
    attackPower: 9,
    counterAttackPower: 25,
    img: "assets/images/kylo_ren.jpg", 
}

var lukeSkywalker = {
    id: "lukeSkywalker",
    name: "Luke Skywalker",
    healthPoints: 100,
    attackPower: 12,
    counterAttackPower: 35,
    img: "assets/images/luke_skywalker.jpg", 
}

var rey = {
    id: "rey",
    name: "Rey",
    healthPoints: 110,
    attackPower: 9,
    counterAttackPower: 30,
    img: "assets/images/rey.jpg", 
}

var snoke = {
    id: "snoke",
    name: "Snoke",
    healthPoints: 90,
    attackPower: 15,
    counterAttackPower: 50,
    img: "assets/images/snoke.png", 
}

//FUNCTIONS

// Function to dynamically setup the divs and child divs to show the character cards
function setCharacterCards(area){
    $.each(availableCharacters, function(){       
        var charCard = $("<div>");
        charCard.addClass("character-card");
        charCard.attr("data-name", this.id);
        $(area).append(charCard);

        var charName = $("<div>");
        charName.addClass("character-name");
        charName.text(this.name);
        charCard.append(charName);

        var charImg = $("<img>");
        charImg.addClass("character-img");
        charImg.attr("src", this.img);
        charCard.append(charImg);

        var charHealthPoints = $("<div>");
        charHealthPoints.addClass("character-health");
        charHealthPoints.text(this.healthPoints);
        charCard.append(charHealthPoints);  
    });
}

// Function to reset the displays after defeating an opponent
function resetDisplays(){
    $("#attack-button").attr("style", "display: none;");
    $("#attack-message").attr("style", "display: none;");
    $("#counter-attack-message").attr("style", "display: none;");
}

//LOGIC
var availableCharacters = [lukeSkywalker, rey, kyloRen, snoke];
var yourCharacter = null;
var defender = null;
var gameOver = false;

$(document).ready(function(){
    //Setup the character cards in the character select area
    setCharacterCards("#character-select-area");

    //Logic to handle the user selecting a character, and then to populate the enemy area
    $("#character-select-area").on("click", ".character-card", function(){
        yourCharacter = availableCharacters[$.inArray(eval($(this).attr("data-name")), availableCharacters)];
        $("#your-character-area").append(this);
        $(this).attr("id", "your-character");
        availableCharacters.splice($.inArray(yourCharacter, availableCharacters),1);

        $("#character-select-section").attr("style", "display: none;");
        setCharacterCards("#enemies-available-area");
    });

    //Logic to handle the user selecting an enemy, and then to move them into the defender area
    $("#enemies-available-area").on("click",".character-card", function(){
        if(defender === null){
            $("#win-loss-message").text("");
            defender = availableCharacters[$.inArray(eval($(this).attr("data-name")), availableCharacters)];
            $("#defender-area").append(this);
            $(this).attr("id", "current-enemy");
            availableCharacters.splice($.inArray(defender, availableCharacters),1);
            $("#attack-button").attr("style", "display: inherit;"); 
        }
    });

    //Handle combat logic, and check for wins or losses
    $("#attack-button").on("click",function(){
        defender.healthPoints -= yourCharacter.attackPower;
        $("#current-enemy").find(".character-health").text(defender.healthPoints);
        
        if(defender.healthPoints > 0){
            yourCharacter.healthPoints -= defender.counterAttackPower;
            $("#your-character").find(".character-health").text(yourCharacter.healthPoints);
            $("#game-message").attr("display", "inherit");
            $("#attack-message").text("You attacked " + defender.name + " for " + yourCharacter.attackPower + " damage.");
            $("#counter-attack-message").text(defender.name + " attacked you for " + defender.counterAttackPower + " damage.");
        }
        else{
            $("#current-enemy").attr("style", "display: none;");
            $("#current-enemy").attr("id", "previousEnemy");
            $("#win-loss-message").text("You have defeated " + defender.name + ", you can choose to fight another enemy."); 
            defender = null;

            resetDisplays();

            if(availableCharacters.length === 0){
                gameOver = true;
                $("#win-loss-message").text("You have defeated all enemies. You won!");
                $("#reset-button").attr("style", "display: inherit;");
            }
        }

        yourCharacter.attackPower += yourCharacter.attackPower;
        
        if(yourCharacter.healthPoints <= 0){
            gameOver == true;
            resetDisplays();
            $("#win-loss-message").text(defender.name + " defeated you. GAME OVER");
            $("#reset-button").attr("style", "display: inherit;");
        }

    });

    //Reload the page
    $("#reset-button").on("click", function(){
        location.reload();
    });

});
