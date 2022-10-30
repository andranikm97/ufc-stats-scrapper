import './styles.css';

const input = document.getElementById('input');
const dropdown = document.getElementById('dropdown');
input.addEventListener('keyup', function () {
  if (this.value.length > 1) {
    fetch('http://localhost:3000/search_fighter?' + new URLSearchParams({
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
    fightersListItem.addEventListener('click', function () {
      fighterLink.click();
    })
    fightersListItem.append(fighterLink);
    dropdown.appendChild(fightersListItem);
  }
}

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
}