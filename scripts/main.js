// =============== Variables ==================

const myBets = document.querySelector(".bets")
const lines = document.querySelectorAll(".line")

//============== Extraction fichier JSON ==========

fetch(`scripts/datas.json`)
  .then(response => response.json())
  .then(data => {
    console.log(data);

    const display = () => {
      data.matchs.forEach(function(singleBet) {
        myBets.innerHTML += `<div class="line" data-index="${singleBet.match_id}">
        <div class="game">
            <div class="home">${singleBet.hometeam}</div>
            <div>-</div>
            <div class="visitor">${singleBet.awayteam}</div>
        </div>
        <div class="button win">${singleBet.home_odd}</div>
        <div class="button draw">${singleBet.draw_odd}</div>
        <div class="button lose">${singleBet.away_odd}</div>
        </div>
    </div>`
      });
    }

    // on appelle la fonction display, au chargement du fichier datas.json
    display()
    
  })
  .catch(error => {console.log("Erreur lors de la récup des données :", error);
})



//============== FONCTIONS =================


//============== EVENTS =================

lines.forEach(element => {
  element.addEventListener('click', function(e) {
    if(e.target.classList.contains('button')) {
      if (e.target.classList.contains('purple')){
        e.target.classList.remove('purple')
      }
      else {
        if (myBets.querySelector('.purple')){
         myBets.querySelector('.purple').classList.remove('purple')
          e.target.classList.add('purple')
        }
        else {
          e.target.classList.add('purple')
        }
      }
    }
  })
})