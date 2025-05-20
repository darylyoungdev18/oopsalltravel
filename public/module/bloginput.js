export function toggleVideoInput() {
    const videoInputDiv = document.getElementById('videoInput');
    const detailsInputDiv = document.getElementById('detailsInput');
    const isVideoBlogCheckbox = document.getElementById('Is_Video_Blog');
    if (isVideoBlogCheckbox.checked) {
      videoInputDiv.style.display = 'block';
      detailsInputDiv.style.display = 'none';
    } else {
      videoInputDiv.style.display = 'none';
      detailsInputDiv.style.display = 'block';
    }
  }