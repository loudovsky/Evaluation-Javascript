// =============== Variables ==================

const myBetsDiv = document.querySelector(".bets")
const lines = document.querySelectorAll(".line")
const right_section = document.querySelector(".right")
const placedBets = document.querySelector(".content")
const numberOfBets = document.querySelector(".nb")
const puttinInput = document.querySelector(".putting_input")
const odds = document.querySelector(".odds_value")
const gains = document.querySelector(".gain_value")
const placing = document.querySelector(".placing")
const moon = document.querySelector(".fa-moon")
const gear = document.querySelector(".fa-gear")
const left = document.querySelector(".left")
const country = document.querySelector(".country")
const yourBets = document.querySelector(".your_bets")
let int = 0

let on_off = localStorage.getItem('switch') || "VRAI"
console.log(`on_off vaut ${on_off}`);

// =============== Mes tableaux d'objets ==================

let myBets = []

//============== FONCTIONS =================

// permet d'ajouter la classe "dark" si les div et sections suivantes n'en contiennent pas. Si les div et sections contiennent déjà la classe "dark", alors celle-ci est retirée.
const switchMode = () => {
  left.classList.toggle('dark')
  moon.classList.toggle('dark')
  gear.classList.toggle('dark')
  country.classList.toggle('dark')
  yourBets.classList.toggle('dark')
  myBetsDiv.classList.toggle('dark')
}

// à partir du data-index de la ligne à supprimer qu'on a récupérée précédemment, on peut (1)supprimer la ligne de pari dans Your bets, grâce à splice(), (2)enlever la surbrillance de la cote qui lui correspond dans le grand tableau affiché à gauche dans myBetsDiv
const deleteLine = (lineToKill) => {

  let match_id_target = myBets[lineToKill].match_id // on cherche la valeur du match_id de cette ligne de pari
  
  myBetsDiv.querySelector(`[match-id="${match_id_target}"]`).querySelector('.purple').classList.remove('purple') //on va chercher dans myBetsDiv la ligne qui possède le même match_id. On retire ensuite la coloration "purple" de la case cochée présente sur cette ligne

  myBets.splice(lineToKill, 1) //line to kill correspond à l'endroit où est entamée la coupure dans le tableau myBets, le chiffre 1 indique la longeur de cette coupure à savoir 1 ligne. 
  printAllBets(myBets) // on affiche la version actualisée de myBets
  printNumberOfBets(myBets) // on affiche le nombre de paris dans le titre de Your bets
  totOdds(myBets) // on calcule le total des cotes
  totGain(totOdds(myBets)) // on calcule le total des gains
  if (myBets.length === 0) {
    placing.classList.add('hidden') // si la somme des paris est égale à zéro, on retire l'affichage de la partie placing
  }
}

const totGain = (nb) => {
  let gain = puttinInput.value * nb // on fait le produit de l'argent misé et du nombre nb (correspondant au produit des cotes)
  gains.innerHTML = Math.round(gain * 100) / 100 //on arrondit le résultat des gains potentiels, pour obtenir un nombre à deux décimales. On injecte ce nombre dans le DOM
}

const totOdds = (tab) => {
  let prod = 1
  tab.forEach(function(element) {
  prod *= element.odd 
  }) // on calcule le produit de chaque cote du tableau
  odds.innerHTML = Math.round(prod * 100) / 100
  //on arrondit le résultat, pour obtenir un nombre à deux décimales et on l'injecte dans le DOM. On injecte ce nombre dans le DOM
  console.log(`le produit vaut : ${prod}`);
  return prod //on retourne la valeur du produit des cotes qui nous servira plus tard dans la fonction totGain()
}

// permet d'ajouter dans le tableau myBets, une nouvelle ligne de pari avec ses diférentes caractéristiques
const addBetLine = (qui, contrequi, combien, resultat, lequel) => {
  let newBetLine = {
      home : qui,
      away : contrequi,
      odd : combien,
      result : resultat,
      match_id : lequel,
  }
  myBets.push(newBetLine)
  console.log(myBets);
}

// génère un nombre aléatoire entre min & max
const randomIntFromInterval = (min, max) =>{ 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// génère une image d'arrière plan au hasard, à partir d'une sélection de 3 images et ce à l'aide du nombre au hasard entre 1 et 3 généré par randomIntFromInterval()
const generateRandomBackGround = () => {
  int = randomIntFromInterval(1, 3)
  console.log(`int vaut ${int}`);
  right_section.style.backgroundImage = `url(../images/bg${int}.png)`
}

// affiche dans une petite fenêtre en bas à droite, dans la partie "Your bets", le nombre de paris réalisés
const printNumberOfBets = (tab) => {
  numberOfBets.innerHTML = `${parseInt(tab.length)}`
} 

// affiche le tableau des paris "myBets" dans la section "Your bets".
const printAllBets = (tab) => {
  placedBets.innerHTML = '' // permet de remettre l'affichage du tableau à zéro
  printNumberOfBets(tab)
  if (myBets.length > 0) {
    placedBets.style.padding = "15px" // permet de mettre un padding de 15px sur la section placed bets
 
    tab.forEach((tabElement, index) => {
      if (tabElement.result === "win") {
        placedBets.innerHTML +=
        `<div class="single-line" data-index="${index}"><div class="calc"><b>${tabElement.home}</b><div class="bin">${tabElement.odd}<span class="delete" style="cursor:pointer">🗑️</span></div></div><div class="teams">${tabElement.home} - ${tabElement.away}</div></div>`
      }
      else if (tabElement.result === "dra") {
        placedBets.innerHTML +=
        `<div class="single-line" data-index="${index}"><div class="calc"><b>Match Nul</b><div class="bin">${tabElement.odd}<span class="delete" style="cursor:pointer">🗑️</span></div></div><div class="teams">${tabElement.home} - ${tabElement.away}</div></div>`
      }
      else if (tabElement.result === "los") {
        placedBets.innerHTML +=
        `<div class="single-line" data-index="${index}"><div class="calc"><b>${tabElement.away}</b><div class="bin">${tabElement.odd}<span class="delete" style="cursor:pointer">🗑️</span></div></div><div class="teams">${tabElement.home} - ${tabElement.away}</div></div>`
      } 
      // poser les 3 conditions 'win' 'draw' ou 'loss' permet d'afficher l'équipe pour laquelle on a parié une victoire ou le cas échéant "Match nul"
    });
  }
  else {
    placedBets.style.padding = "0px" // on remet le padding de la partie "placed bets" à zéro si le nombre de paris placés est nul.
  }
 }

//============== Extraction fichier JSON ==========

fetch(`scripts/datas.json`)
  .then(response => response.json())
  .then(data => {
    console.log(data);

    const display = () => {
      data.matchs.forEach(function(singleBet) {
        myBetsDiv.innerHTML += `<div class="line" match-id="${singleBet.match_id}">
        <div class="game">
            <div class="home">${singleBet.hometeam}</div>
            <div>-</div>
            <div class="visitor">${singleBet.awayteam}</div>
        </div>
        <div class="win button">${singleBet.home_odd}</div>
        <div class="dra button">${singleBet.draw_odd}</div>
        <div class="los button">${singleBet.away_odd}</div>
        </div>
    </div>`
      });
    }

    // on appelle la fonction display, au chargement du fichier datas.json, pour que les rencontres et leurs différentes cotes s'affichent dans le DOM
    display()

    //============== EVENTS (inclus dans le fetch) =================


    // Permet de sélectionner victoire OU égalité OU défaite sur  chaque recontre. Grâce à la délégation d'évènement sur la div '. bets', on peut ajouter ou retirer la classe "purple" au bouton sur lequel on a cliqué.
    myBetsDiv.addEventListener('click', function(e) {
      if(e.target.classList.contains('button')) {
        
        if (e.target.classList.contains('purple')) {
          
          e.target.classList.remove('purple')

          // Le but ici est de supprimer dans le tableau d'objets myBets, la ligne correspondant au bouton qu'on vient de "déselectionner". Pour se faire, il faut chercher l'index de la ligne qui a été ajoutée dans le tableau lorsque l'on a auparavant activé ce bouton.
         
          // On cherche d'abord la valeur du 'match-id' de la div sur laquelle on a cliqué

          const matchId = parseInt(e.target.closest(".line").getAttribute("match-id"));
          
          // On cherche ensuite dans le tableau myBets, la ligne qui possède possède la même valeur de match_id. En d'autres termes, on doit retrouver la ligne qui reprend le pari qui a été fait sur cette rencontre.

          // la fonction findIndex permet de retrouver l'index de la ligne qui possède en "match_id" la même valeur que la constante matchId, soit l'ID du match sur lequel on vient de cliquer dans la div '.bets' (située dans le DOM). Si aucune ligne n'a un "match_id" égal à la constante 'matchID', alors l'index sera égal à -1 qu'on peut considérer comme un message d'erreur.
          
          const isSameId = (element) => element.match_id === matchId

          const index = myBets.findIndex(isSameId)
          
          // Une fois l'index de la ligne identifié, on supprime la ligne ciblée du tableau myBets avec l'outil array.splice(). Le chiffre 1 après 'index' représente le nombre de lignes à retirer. En effet, il ne faut ôter qu'une seule ligne à partir du repère indiqué par la constante 'index'

          if (index !== -1) {
            myBets.splice(index, 1);
          }
          else {
            console.log(`Erreur sur findIndex!!!`)
          }

          // on affiche enfin dans le DOM le tableau myBets actualisé, grâce à la fct printAllBets

          printAllBets(myBets);
        }
      
        else {

          // Permet d'extraire le match et ses propriétés (équipes, cotes home/draw/away, etc), en fonction de sa place ("data-index") dans le tableau contenu dans le fichier JSO      
          let i = parseInt(e.target.closest(".line").getAttribute("match-id")) - 1 // on doit soustraire - 1, car le première ligne du tableau a pour coordonnée 0 
          let home = data.matchs[i].hometeam
          let away = data.matchs[i].awayteam
          let odd = parseFloat(e.target.innerHTML)
          let result = e.target.getAttribute("class").slice(0, 3)
          let match_index = i + 1  // en faisant i + 1, on retrouve la valeur        "match-id"

          if (e.target.parentElement.querySelector('.purple')) {
            
            // On décoche la case de pari qui était sélectionnée à la base, càd avant qu'on ne clique sur une autre cote.
            e.target.parentElement.querySelector('.purple').classList.remove('purple');

            //Ici, même principe que plus haut où on doit retirer la ligne de la section "Your bets" correspondant à la cote qui vient d'être décochée.
            const matchId = parseInt(e.target.closest(".line").getAttribute("match-id"));
            const isSameId = (element) => element.match_id === matchId
            const index = myBets.findIndex(isSameId)
            if (index !== -1) {
              myBets.splice(index, 1);
            }

            // On ajoute la surbrillance à la case de pari sur laquelle on vient de cliquer
            e.target.classList.add('purple')

            // On ajoute une ligne de pari dans le tableau myBets avec toutes les coordonnées sauvées plus haut.
            addBetLine(home, away, odd, result, match_index)

            // On affiche le tableau actualisé, dans la section "Your Bets"
            printAllBets(myBets)
          }
          else {
            // Dans le cas où aucun bouton de la div line n'était en surbrillance (classe contenant "purple"), on ajoute la classe "purple" au bouton sur lequel on vient de cliquer pour qu'il apparaisse en surbrillance
            e.target.classList.add('purple')


            // On ajoute une ligne de pari dans le tableau myBets avec toutes les coordonnées sauvées plus haut.
            addBetLine(home, away, odd, result, match_index)

            // On affiche le tableau actualisé, dans la section "Your Bets"
            printAllBets(myBets)
          }
        }
        // on calcule ensuite le total des cotes en les multipliants unes à l'unes. Mais seulement si le nombre de paris est supérieur à 0
        if (myBets.length > 0) {
          console.log(`myBets est plus long que 0`);
          totOdds(myBets)
          totGain(totOdds(myBets))
          placing.classList.remove('hidden')
        }
        // si le nombre de paris est égal à 0, on remet les côtes et les gains à zéro et on ajoute la classe "hidden" pour que la div "placing" n'apparaisse plus.
        else {
          odds.innerHTML = "0.00"
          gains.innerHTML = "0.00"
          placing.classList.add('hidden')
        } 
      } 
    })

  })
  .catch(error => {console.log("Erreur lors de la récup des données :", error);
  })

  


//================ FONCTIONS enclenchées au chargement de la page =============

//Génère une image d'arrière plan au hasard dès l'ouverture de la page
generateRandomBackGround()


// Si on_off est FAUX dès l'ouverture de la page, càd si la dernière valeur stockée dans le localStorage avant la fermeture de la page était "FAUX" , alors le switchMode s'enclenche et la page se met automatiquement en Dark Mode. L'utilisateur conserve ainsi l'apparence de la page avant sa précédente fermeture.

if (on_off === "FAUX") {
  switchMode()
}

//=============================== EVENTS============================ 

// Lorsqu'on modifie la valeur de l'input dans "Your bets", cet évènement enclenche le calcul et l'affichage de la valeur total des gains potentiels. Si le nombre de paris introduits vaut 0, les valeurs des cotes et des gains totaux est remis à zéro
puttinInput.addEventListener("input", (event) => {
  if (myBets.length > 0) {
    totGain(totOdds(myBets)) 
  }
  else {
    odds.innerHTML = "0.00"
    gains.innerHTML = "0.00"
  }
});



//Si on appuye sur le sigle 🗑️, cet évènement permet de supprimer grâce à la fonction deleteLine() la ligne de pari sur laquelle on se trouve. La suppression se fait autant à l'affichage dans la section "Your bets" que dans le tableau myBets.
placedBets.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete')) {
    let placeDansTableau = parseInt(e.target.closest('.single-line').getAttribute('data-index')) // on capte la position de la ligne grâce à son attribut data-index
    console.log(`placeDansTableau vaut : `);
    console.log(placeDansTableau);
    deleteLine(placeDansTableau)
  }
});

//Lorsque l'on appuye sur le sigle lune, le dark mode s'enclenche grâce à la fct switchMode. On conserve aussi l'information qu'on se trouve dans le dark mode (on_off = "FAUX") en la stockant dans le localStorage
moon.addEventListener('click', function() {
  switchMode()
  on_off = "FAUX"
  localStorage.setItem('switch', "FAUX")
  console.log(`on_off vaut ${on_off}`);
})

//Lorsque l'on appuye sur le sigle roue dentée, le day-time mode s'enclenche grâce à la fct switchMode. On conserve aussi l'information qu'on se trouve dans le day-time (on_off = "VRAI") en la stockant dans le localStorage
gear.addEventListener('click', function() {
  switchMode()
  on_off = "VRAI"
  localStorage.setItem('switch', "VRAI")
  console.log(`on_off vaut ${on_off}`);
})