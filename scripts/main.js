// =============== Variables ==================

const myBetsDiv = document.querySelector(".bets")
const lines = document.querySelectorAll(".line")
const right_section = document.querySelector(".right")
const placedBets = document.querySelector(".content")
const numberOfBets = document.querySelector(".nb")
let int = 0

// =============== Mes tableaux d'objets ==================

let myBets = []

//============== FONCTIONS =================

const addBetLine = (qui, contrequi, combien, resultat, lequel) => {
  let newBetLine = {
      home : qui,
      away : contrequi,
      odd : combien,
      result : resultat,
      index : lequel,
  }
  myBets.push(newBetLine)
  console.log(myBets);
}

// génère un nombre aléatoire entre min & max
const randomIntFromInterval = (min, max) =>{ 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// génère une image d'arrière plan au hasard, à partir d'une sélection de 3 images
const generateRandomBackGround = () => {
  int = randomIntFromInterval(1, 3)
  console.log(`int vaut ${int}`);
  right_section.style.backgroundImage = `url(../images/bg${int}.png)`
}

// affiche le récapitulatif des paris dans une petite fenêtre en bas à droite, sous la partie "Your bets"

const printNumberOfBets = (tab) => {
  numberOfBets.innerHTML = `${parseInt(tab.length)}`
} 

const printItemLine = (tab) => {
  placedBets.innerHTML = ''
  printNumberOfBets(tab)
  if (myBets.length > 0) {
    placedBets.style.padding = "15px"

    tab.forEach((tabElement, index) => {
    placedBets.innerHTML +=
    `
    <div class="single-line" data-index="${index}"><div class="calc"><b>${tabElement.result}</b><div>${tabElement.odd}<span class="delete" style="cursor:pointer">🗑️</span></div></div><div class="teams">${tabElement.home} - ${tabElement.away}</div></div>
    `
    });
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

    //============== EVENTS =================


    // Permet de sélectionner victoire OU égalité OU défaite sur  chaque recontre. Grâce à la délégation d'évènement sur la div '. bets', on peut ajouter ou retirer la classe "purple" au bouton   sur lequel on a cliqué.
    myBetsDiv.addEventListener('click', function(e) {
      if(e.target.classList.contains('button')) {
        console.log(`clique sur bouton`);
        if (e.target.classList.contains('purple')){
        e.target.classList.remove('purple')
        }
        else {
          if (e.target.parentElement.querySelector('.purple')){
            e.target.parentElement.querySelector('.purple').  classList.remove('purple');
            e.target.classList.add('purple')
          }
          else {
          e.target.classList.add('purple')
          }
        }

        // Permet d'extraire la rencontre et ses propriétés (équipes, cotes home/draw/away, etc), en fonction de sa place ("data-index") dans le tableau contenu dans le fichier JSON
        let i = parseInt(e.target.closest(".line").getAttribute("match-id")) - 1
        let home = data.matchs[i].hometeam
        let away = data.matchs[i].awayteam
        let odd = parseFloat(e.target.innerHTML)
        let result = e.target.getAttribute("class").slice(0, 3)
        let match_index = i

        addBetLine(home, away, odd, result, match_index)
        printItemLine(myBets)
      }

      
      
    })

  })
  .catch(error => {console.log("Erreur lors de la récup des données :", error);
  })

  generateRandomBackGround()

//============== EVENTS =================


 