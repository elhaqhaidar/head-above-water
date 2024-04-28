// SMOOTH SCROLLING SCRIPT
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      document.querySelector(targetId).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// FOR TANYA'S PART
     var selectedZone = 0;
      var zones = ["No selection","Waterfront", "scale"];
      var grades = ["", "A", "B"];

      function updateHeading() {
            var heading = document.getElementById("zone-heading"); // Get the h2 by its ID
            heading.innerText = zones[selectedZone]; // Set the text to the selected zone
        }

        function updateGrade() {
            var heading = document.getElementById("zone-grade"); // Get the h2 by its ID
            heading.innerText = grades[selectedZone]; // Set the text to the selected zone
        }

        // Run the function when the DOM is fully loaded
        document.addEventListener("DOMContentLoaded", updateHeading);

        // Run the function when the DOM is fully loaded
        document.addEventListener("DOMContentLoaded", updateHeading);

        // Function to open the modal
        function openModal() {
            document.querySelector('.modal-overlay').style.display = 'flex';
        }

        // Function to close the modal
        function closeModal() {
            document.querySelector('.modal-overlay').style.display = 'none';
        }
        function createGrid() {
            var width = 800;
            var height = 700;

            var svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            var rows = 10;
            var cols = 10;

            var cellWidth = width / cols;
            var cellHeight = height / rows;

            for (var row = 0; row < rows; row++) {
                for (var col = 0; col < cols; col++) {
                    var x = col * cellWidth;
                    var y = row * cellHeight;

                    svg.append("rect")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("width", cellWidth)
                        .attr("height", cellHeight)
                        .attr("class", "grid-cell")
                        .on("click", function(){
                          var index = parseInt(d3.select(this).attr("x")) / cellWidth + 
                                (parseInt(d3.select(this).attr("y")) / cellHeight) * cols;
                          selectedZone = 1;
                          updateHeading();
                          updateGrade();
                          openModal();
                        });
                }
            }
        }

        document.addEventListener("DOMContentLoaded", createGrid);


// FOR HAIDAR'S PART
mapboxgl.accessToken = 'pk.eyJ1IjoiZWxoYXFoIiwiYSI6ImNsdDNhcThkcTF1cHEya3JvbHY4eDJtaWIifQ.JFJvJb6fqR8On7uTnx4HVA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-71.058884, 42.360081],
    zoom: 12
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

map.on('load', () => {
    map.addSource('elhaqh.60kkelua', {
        'type': 'raster',
        'url': 'mapbox://elhaqh.60kkelua'
    });

    map.addLayer({
        'id': '1630',
        'source': 'elhaqh.60kkelua',
        'type': 'raster',
        'layout': {
            'visibility': 'none' // Initially hide the layer
        },
    });

    map.addSource('elhaqh.4l9l2pmj', {
        'type': 'raster',
        'url': 'mapbox://elhaqh.4l9l2pmj'
    });

    map.addLayer({
        'id': '1838',
        'source': 'elhaqh.4l9l2pmj',
        'type': 'raster',
        'layout': {
            'visibility': 'none' // Initially hide the layer
        },
    });

    map.addSource('elhaqh.6dftg5jc', {
        'type': 'raster',
        'url': 'mapbox://elhaqh.6dftg5jc'
    });

    map.addLayer({
        'id': '1906',
        'source': 'elhaqh.6dftg5jc',
        'type': 'raster',
        'layout': {
            'visibility': 'none' // Initially hide the layer
        },
    });

    let currentLayerId = null;

    const layerText = document.getElementById('layerText'); // Get the layer text element

    document.getElementById('layerSlider').addEventListener('input', function() {

        const value = parseInt(this.value);

        if (value === 0) {
            hideAllLayers();

        } else if (value === 1) {
            switchLayer('1630');
            layerText.textContent = '1630'; // Display '1630' when slider value is 1

        } else if (value === 2) {
            switchLayer('1838');
            layerText.textContent = '1838'; // Display '1838' when slider value is 2
        
        } else if (value === 3) {
            switchLayer('1906');
            layerText.textContent = '1906'; // Display '1838' when slider value is 3
        }
    });

    function switchLayer(newLayerId) {
        hideAllLayers();
        map.setLayoutProperty(newLayerId, 'visibility', 'visible');
        map.setPaintProperty(newLayerId, 'raster-opacity', 0.8);
        currentLayerId = newLayerId;
    }

    function hideAllLayers() {
        if (currentLayerId) {
            map.setLayoutProperty(currentLayerId, 'visibility', 'none');
            currentLayerId = null;
        }
    }
});


// FOR HABIN'S PART
$(window).scroll(function() {
  let $window = $(window),
      $body = $('body'),   
      $section = $('.section');
  let scroll = $window.scrollTop() + ($window.height() * 1 / 10); // Adjusted for activation point

  $section.each(function() { 
      let $currentSection = $(this);
      if ($currentSection.position().top <= scroll && $currentSection.position().top + $currentSection.height() > scroll) {
          // Section is in the active area
          if (!$currentSection.hasClass('active')) {
              $('.section').removeClass('active'); // Remove 'active' from all sections
              $body.removeClass(function (index, css) {
                  return (css.match (/(^|\s)color-\S+/g) || []).join(' ');
              });
              $currentSection.addClass('active'); // Add 'active' to this section
          }
      } else {
          // Section is not in the active area
          $currentSection.removeClass('active');
      }
  });
}).scroll();

// FOR DANNY'S PART
// $(window).scroll(function() {
//     let $window = $(window),
//         $body = $('body'),   
//         $section = $('.section-danny');
//     let scroll = $window.scrollTop() + ($window.height() * 1 / 100); // Adjusted for activation point
  
//     $section.each(function() { 
//         let $currentSection = $(this);
//         if ($currentSection.position().top <= scroll && $currentSection.position().top + $currentSection.height() > scroll) {
//             // Section is in the active area
//             if (!$currentSection.hasClass('active')) {
//                 $('.section-danny').removeClass('active'); // Remove 'active' from all sections
//                 $body.removeClass(function (index, css) {
//                     return (css.match (/(^|\s)color-\S+/g) || []).join(' ');
//                 });
//                 $currentSection.addClass('active'); // Add 'active' to this section
//             }
//         } else {
//             // Section is not in the active area
//             $currentSection.removeClass('active');
//         }
//     });
//   }).scroll();
    