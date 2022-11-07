import './styles.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
const serverEndpoint = 'http://localhost:3000';
const RIGHT_SIDE = "right";
const LEFT_SIDE = "left";
const input = document.getElementById('input');
const dropdown = document.getElementById('dropdown');
input.addEventListener('keyup', function () {
  if (this.value.length > 1) {
    fetch(serverEndpoint + '/search_fighter?' + new URLSearchParams({
      query: this.value.trim()
    }))
      .then(res => res.json())
      .then((data: Fighter[]) => drawDropdown(data));
  } else {
    clearDropdown();
  }
});

function drawDropdown(fighters: Fighter[]) {
  clearDropdown();
  for (const fighter of fighters) {
    const fightersListItem = document.createElement('li');
    const fighterLink = document.createElement('a');
    fighterLink.setAttribute('href', fighter.url);
    fighterLink.setAttribute('target', '_blank');
    fighterLink.innerText = `${fighter.firstname} ${fighter.lastname} ${fighter.nickname ? `- ${fighter.nickname}` : ''}`;
    const leftSideButton = document.createElement('i');
    leftSideButton.classList.add('fa-solid', 'fa-arrow-left');
    leftSideButton.addEventListener('click', function () {
      addChosenFighterCard(LEFT_SIDE, fighter.firstname, fighter.lastname, fighter.id);
    });
    const rightSideButton = document.createElement('i');
    rightSideButton.classList.add('fa-solid', 'fa-arrow-right');
    rightSideButton.addEventListener('click', function () {
      addChosenFighterCard(RIGHT_SIDE, fighter.firstname, fighter.lastname, fighter.id);
    });
    fightersListItem.appendChild(leftSideButton);
    fightersListItem.append(fighterLink);
    fightersListItem.appendChild(rightSideButton);
    dropdown.appendChild(fightersListItem);
  }
}

function addChosenFighterCard(side, firstname, lastname, fighterId) {
  const chosenFightersContainer = document.getElementById(`chosen_fighter_${side}`);
  chosenFightersContainer.innerHTML = '';
  const chosenFighter = document.createElement('div');
  chosenFighter.innerHTML = `${firstname} ${lastname}`;
  chosenFighter.setAttribute('data-fighterid', fighterId);
  chosenFightersContainer.appendChild(chosenFighter);
};

function removeChosenFighterCard() {

};

function clearDropdown() {
  dropdown.innerHTML = '';
}

type Fighter = {
  firstname: string
  lastname: string
  nickname: string
  url: string
  height: string
  weight: string
  reach: string
  win: string
  loss: string
  draw: string
  belt: string
  id: string
}