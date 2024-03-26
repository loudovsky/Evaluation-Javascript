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
let int = 0

// =============== Mes tableaux d'objets ==================

let myBets = []

//============== FONCTIONS =================

const deleteLine = (lineToKill) => {
  myBets.splice(lineToKill, 1)
  printAllBets(myBets)
  printNumberOfBets(myBets)
  if (myBets.length === 0) {
    placing.classList.add('hidden')
  }
  myBets[lineToKill].match_id
}

const totGain = (nb) => {
  gain = puttinInput.value * nb
  gains.innerHTML = Math.round(gain * 100) / 100
}

const totOdds = (tab) => {
  let prod = 1
  tab.forEach(function(element) {
  prod *= element.odd 
  })
  odds.innerHTML = Math.round(prod * 100) / 100
  console.log(`le produit vaut : ${prod}`);
  return prod
}

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

// affiche le récapitulatif des paris dans une petite fenêtre en bas à droite, sous la partie "Your bets"

const printNumberOfBets = (tab) => {
  numberOfBets.innerHTML = `${parseInt(tab.length)}`
} 


const printAllBets = (tab) => {
  placedBets.innerHTML = ''
  printNumberOfBets(tab)
  if (myBets.length > 0) {
    placedBets.style.padding = "15px"
 
    tab.forEach((tabElement, index) => {
      if (tabElement.result === "win") {
        placedBets.innerHTML +=
        `<div class="single-line" data-index="${index}"><div class="calc"><b>${tabElement.home}</b><div>${tabElement.odd}<span class="delete" style="cursor:pointer">🗑️</span></div></div><div class="teams">${tabElement.home} - ${tabElement.away}</div></div>`
      }
      else if (tabElement.result === "dra") {
        placedBets.innerHTML +=
        `<div class="single-line" data-index="${index}"><div class="calc"><b>Match Nul</b><div>${tabElement.odd}<span class="delete" style="cursor:pointer">🗑️</span></div></div><div class="teams">${tabElement.home} - ${tabElement.away}</div></div>`
      }
      else if (tabElement.result === "los") {
        placedBets.innerHTML +=
        `<div class="single-line" data-index="${index}"><div class="calc"><b>${tabElement.away}</b><div>${tabElement.odd}<span class="delete" style="cursor:pointer">🗑️</span></div></div><div class="teams">${tabElement.home} - ${tabElement.away}</div></div>`
      }
    });
  }
  else {
    placedBets.style.padding = "0px"
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

    // on appelle la fonction display, au chargement du fichier datas.json, pour que les rencontres et leurs cotes s'affichent dans le DOM
    display()

    //============== EVENTS (dans le fetch) =================


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

            e.target.parentElement.querySelector('.purple').classList.remove('purple');
            const matchId = parseInt(e.target.closest(".line").getAttribute("match-id"));
            const isSameId = (element) => element.match_id === matchId
            const index = myBets.findIndex(isSameId)
            if (index !== -1) {
              myBets.splice(index, 1);
            }

            e.target.classList.add('purple')
            addBetLine(home, away, odd, result, match_index)
            printAllBets(myBets)
          }
          else {
            e.target.classList.add('purple')
            addBetLine(home, away, odd, result, match_index)
            printAllBets(myBets)
          }
        }
        // on calcule ensuite le total des cotes en les multipliants unes à l'unes. Mais seulement si le nombre de cotes est supérieur à 0
        if (myBets.length > 0) {
          console.log(`myBets est plus long que 0`);
          totOdds(myBets)
          totGain(totOdds(myBets))
          placing.classList.remove('hidden')
        }
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

  

//============== EVENTS =================

generateRandomBackGround()

puttinInput.addEventListener("input", (event) => {
  if (myBets.length > 0) {
    const inputValue = event.target.value;
    totGain(totOdds(myBets)) 
    console.log(`You entered: ${inputValue}`);
  }
  else {
    odds.innerHTML = "0.00"
    gains.innerHTML = "0.00"
  }
});

placedBets.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete')) {
    let placeDansTableau = parseInt(e.target.parentElement.getAttribute('data-index'))
    deleteLine(placeDansTableau)
  }
});

 