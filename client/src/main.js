
const input = document.getElementById('name-input');
input.addEventListener('keyup', function () {
  if (this.value.length > 1) {
    fetch('http://localhost:3000/search_fighter?' + new URLSearchParams({
      query: this.value.trim()
    }))
      .then(res => res.json())
      .then(data => console.log(data));
  }
});