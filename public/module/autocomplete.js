document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('locationPlace');
    const autocompleteList = document.getElementById('autocomplete-list');
  
    input.addEventListener('input', () => {
      const query = input.value;
  
      if (!query) {
        autocompleteList.innerHTML = '';
        return;
      }
  
      fetch(`/api/places?input=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
          autocompleteList.innerHTML = '';
          if (data.predictions) {
            data.predictions.forEach(prediction => {
              const item = document.createElement('li');
              item.textContent = prediction.description;
              item.addEventListener('click', () => {
                input.value = prediction.description;
                autocompleteList.innerHTML = '';
              });
              autocompleteList.appendChild(item);
            });
          }
        })
        .catch(error => console.error('Error:', error));
    });
  });