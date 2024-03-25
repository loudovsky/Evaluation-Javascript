fetch(`scripts/datas.json`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {console.log("Erreur lors de la récup des données :", error);
})

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/loudovsky/Evaluation-Javascript.git
git push -u origin main