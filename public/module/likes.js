document.addEventListener('DOMContentLoaded', function () {
    // Get all like buttons
    const likeButtons = document.querySelectorAll('.like-button');

    likeButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const blogId = this.dataset.blogId;
        const isLike = this.classList.contains('like');
        const url = isLike ? '/blogs/like/' + blogId : '/blogs/unlike/' + blogId;
        const button = this;

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(error => { throw error; });
          }
          return response.json();
        })
        .then(data => {
          document.getElementById('like-count-' + blogId).textContent = data.likeCount;
          if (isLike) {
            button.classList.remove('like');
            button.classList.add('unlike');
            button.textContent = 'Unlike';
          } else {
            button.classList.remove('unlike');
            button.classList.add('like');
            button.textContent = 'Like';
          }
        })
        .catch(error => {
          alert(error.message || 'An error occurred.');
        });
      });
    });
  });