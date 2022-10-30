import './styles.css';

const input = document.getElementById('input');
const dropdown = document.getElementById('dropdown');
input.addEventListener('keyup', function () {
  if (this.value.length > 1) {
    fetch('http://localhost:3000/search_fighter?' + new URLSearchParams({
      query: this.value.trim()
    }))
      .then(res => res.json())
      .then(data => {

      });
  }
});

function drawDropdown(fighters) {
  dropdown.innerHTML = '';
  for (const fighter of fighters) {
    const fightersListItem = document.createElement('li');
    fightersListItem.
      dropdown.appendChild()
  }
}