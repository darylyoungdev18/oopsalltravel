
// THIS IS FOR THE AUTOCOMPLETE
let searchText = document.querySelector('#search-key');
let predictionDropDown = document.querySelector('.search-dropdown');
let titleSpot = document.querySelector('#result-name');
let imageSpot = document.querySelector('.result-image-spot');
let familiarySpot = document.querySelector('.result-familiarity-spot');

       predictionDropDown.classList.add("hide");       
        searchText.addEventListener('input', () => {
            let typing = searchText.value;
            if(typing ==''){
               predictionDropDown.classList.add("hide"); 
            }else{
                predictionDropDown.classList.remove("hide")                        
            };
            fetch(`/api/places?input=${typing}&types(cities)`)
                .then(response => {
                    if(response.status == 200) {
                        return response.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                })
                .then(data => {
                    /* Process the response data here and create search results*/
                    console.log(data); // needed to test if my data appeared
                    if (data.predictions){
                        let predictions = data.predictions.map(prediction => prediction.description );
                        let predictionsid = data.predictions.map(prediction => prediction.place_id );
                        console.log(predictions);
                        predictionDropDown.innerHTML = ""
                        predictions.forEach((prediction, index) => {
                            showLocation(prediction, predictionsid[index]);
                        });
                    }
                    else{
                        console.log('No predictions found in the response this time');
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        });
        searchText.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                predictionDropDown.classList.add("hide"); 
                let firstResult = predictionDropDown.querySelector('li');
                if (firstResult) {
                    firstResult.click();
                }
            }
        });
        searchText.addEventListener('input', () => {
            if (searchText.value.trim() !== '') {
              predictionDropDown.classList.remove('hide');
              predictionDropDown.classList.add('fade-in-content');
            } else {
              predictionDropDown.classList.add('hide');
              predictionDropDown.classList.remove('fade-in-content');
            }
          });
          
          searchText.addEventListener('blur', () => {
            setTimeout(() => {
              predictionDropDown.classList.add('hide');
              predictionDropDown.classList.remove('fade-in-content');
            }, 200);
          });
          
          searchText.addEventListener('focus', () => {
            if (searchText.value.trim() !== '') {
              predictionDropDown.classList.remove('hide');
              predictionDropDown.classList.add('fade-in-content');
            }
          });

      export   function showLocation(location, locationid){
            predictionDropDown.insertAdjacentHTML('beforeend', `<li id="${locationid}"> ${location}</li>` );
            let liContent = document.getElementById(locationid);
            liContent.addEventListener('click', () => renderInfo(location, locationid));   

        }
       export  function renderInfo(placedescription, placeId){
            predictionDropDown.classList.add("hide");
            predictionDropDown.classList.remove("fade-in-content") 
            predictionDropDown.innerHTML = "";
            titleSpot.innerHTML = placedescription;
            let lastCommaIndex = placedescription.lastIndexOf(',');
            let textAfterLastComma = placedescription.substring(lastCommaIndex + 1).trim();
     
            fetch(`/api/place-details?placeId=${placeId}&fields=name,photos`)
            .then(response => {
                if(response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then(data => {
                if (data.result && data.result.photos) {  // Check if photos are available
                    const photos = data.result.photos;    // Access the photos array
                    imageSpot.innerHTML = '';             // Clear existing images

                    for (let i = 0; i < data.result.photos.length && i < 6; i++){
                        let photo = data.result.photos[i];
                        let photoUrl = `/api/place-photo?photoReference=${photo.photo_reference}`;
                        imageSpot.innerHTML += `<img class="result-image" src="${photoUrl}">`;  // add new image elements
                        imageSpot.classList.add("fade-in-content");
                    };
                } else {
                    console.log('No photos found for this place.');
                    imageSpot.innerHTML = '<p>No images available.</p>';  // take care of cases with no pictures
                }
                checkForBlogs(textAfterLastComma);
            })
            .catch(error => {
              console.error('Error fetching place details:', error);
            });
          
          function checkForBlogs(locationName) {
            fetch(`/api/check-blogs?location=${encodeURIComponent(placedescription)}`)
              .then(response => response.json())
              .then(data => {
                console.log(data);
                familiarySpot.innerHTML = '';
                familiarySpot.classList.remove('fade-in-content');                
                if (data.hasBlogs) {
                  familiarySpot.innerHTML = `
                    <p id="result-familiarity">
                      Oh, you picked ${placedescription}! It is a beautiful place where a lot of users had great experiences.
                      Check out some blogs written about trips there!
                    </p>
                    <a class="familiarity-link" href="/blogs?location=${encodeURIComponent(data.locationId)}">
                      Check Out Blogs for ${placedescription}
                    </a>
                  `;
                  familiarySpot.classList.add('fade-in-content');
                } else {
                  // If no blogs exist, display link to all blogs
                  familiarySpot.innerHTML = '';
                  familiarySpot.classList.remove('fade-in-content');
                  familiarySpot.innerHTML = `
                    <p id="result-familiarity">
                      Oh, you picked ${placedescription}! While we don't have blogs for this location yet,
                      feel free to explore other blogs!
                    </p>
                    <a class="familiarity-link" href="/blogs">
                      Explore All Blogs
                    </a>
                  `;
                  familiarySpot.classList.add('fade-in-content');
                }
              })
              .catch(error => {
                console.error('Error checking for blogs:', error);
              });
          }
        
        document.addEventListener('DOMContentLoaded', () => {
            predictionDropDown.classList.add("hide"); 
            const images = [
                { src: '/images/Brussel_Belgium.jpg' },
                { src: 'images/Brussel_Plaza_Belgium.jpg' },
                { src: 'images/Paris_France.jpg' },
                { src: '/images/Porto_highpoint_Portugal.jpg' },
                { src: 'images/porto_portugal beach.jpg' },
                { src: '/images/Trier_Germany.jpg' },
                { src: '/images/Vatican_Italy.jpg' },
                { src: 'images/Old_Rome_Italy.jpg' },
                { src: 'images/Azores_Portugal.jpg'},
                { src: 'images/Venice_Italy.jpg' },
            ];

            const imageSlider = document.getElementById('imageSlider');

            images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.src;
                imgElement.alt = image.alt;
                imgElement.style.maxHeight = '400px';
                imageSlider.appendChild(imgElement);
            });
        });
    };