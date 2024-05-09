let currentMode;

document.addEventListener("DOMContentLoaded", function () {
    const slider = d3.select("#display-slider");
    const sliderValue = d3.select("#slider-value");

// Function to get the display mode based on the slider's value
const getDisplayMode = (value) => {
    switch (value) {
        case "0":
            return "Today";
        case "1":
            return "9 inch";  // Match this with the switch cases
        case "2":
            return "21 inch";
        case "3":
            return "36 inch";
        default:
            return "Today";
    }
};

// Variable to track current mode
currentMode = "Today"; // Initialize with default mode

// Event handler to update the text and other related changes when the slider moves
slider.on("input", function () {
    const sliderPosition = this.value; // Get the slider's current value
    const mode = getDisplayMode(sliderPosition); // Get the descriptive mode based on the slider position

    sliderValue.text(mode); // Update the text element
    console.log("Slider changed to:", sliderPosition, "Mode:", mode); // Debugging to confirm event handling

    updateScatterplot(mode);  // Update scatterplot with the new mode
});
});



// Set up the dimensions of the chart
const margin1 = { top: 100, right: 500, bottom: -5, left: 200 };
const width1 = 1800 - margin1.left - margin1.right;
const height1 = 900 - margin1.top - margin1.bottom;

// Create SVG element for both scatterplot and map
const svg1 = d3.select("body")  // Select the body or any other container where you want the SVG to be appended
    .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom);

// Create the pop-up div
const popup = d3.select("#popup-panel");

// Append a group element for the scatterplot
const svgScatterplot = svg1.append("g")
    .attr("class", "scatterplot")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

// Append a group element for the map
const svgMap = svg1.append("g")
    .attr("class", "map")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

    // Function to update the scatterplot based on the current mode
const updateScatterplot = (mode) => {
    // Load the data from CSV file
    d3.csv("test_data_fp4.csv").then(function(data) {

    // Parse data
    data.forEach(function(d) {
        d.price = +d.Price;
        d.address = d.Address; // Parse address as string
        d.x = +d.Lat;
        d.y = +d.Lon;

    });

    // Set up scales for scatterplot with padding
        const xPadding = 50;
        const yPadding = 50;

        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.x) - xPadding, d3.max(data, d => d.x) + xPadding])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.y) - yPadding, d3.max(data, d => d.y) + yPadding])
            .range([height, 0]);

    const radiusScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.price), d3.max(data, d => d.price)])
        .range([3, 35]); // Adjust the range for appropriate circle sizes


    // Load the GeoJSON data and draw the map
    d3.json("boston.geojson").then(function(bosNeighborhoods) {
        // Projections for map
        const bosProjection = d3.geoAlbers()
            .scale(Math.min(width1, height1) * 520) // Adjust the scale based on the dimensions
            .rotate([71.057, 0])
            .center([0, 42.313])
            .translate([width * 1.45/ 2, height * 1.4 / 2]);

        const bos_geoPath = d3.geoPath().projection(bosProjection);

        // Bind GeoJSON data to SVG and draw map
        svgMap.selectAll("path")
            .data(bosNeighborhoods.features)
            .enter()
            .append("path")
            .attr("d", bos_geoPath)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", 0.5);

        // Convert latitudes and longitudes to projected coordinates
        data.forEach(function(d) {
            const projectedCoordinates = bosProjection([d.Lon, d.Lat]); // Lon is X, Lat is Y
            d.projectedX = projectedCoordinates[0];
            d.projectedY = projectedCoordinates[1];
        });

        console.log(mode);

        // Draw circles for scatterplot
        svgScatterplot.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => d.projectedX)
            .attr("cy", d => d.projectedY)
            .attr("r", d => radiusScale(d.price))
            //.style("fill", d => d.nine === "1" ? " rgb(72, 90, 175)" : "rgb(212, 116, 86)")
            .style("fill", (d) => {
                switch (mode) {
                    case "9 inch":
                        console.log("Case: 9 inch"); // Confirming the case is triggered
                        return d.nine === 1 ? "rgb(72, 90, 175)" : "rgb(212, 116, 86)";
                    case "21 inch":
                        console.log("Case: 21 inch");
                        return d.tewentyone === 1 ? "rgb(72, 90, 175)" : "rgb(212, 116, 86)";
                    case "36 inch":
                        console.log("Case: 36 inch");
                        return d.thirtysix === 1 ? "rgb(72, 90, 175)" : "rgb(212, 116, 86)";
                    case "Today":
                        console.log("Case: Today");
                        return "rgb(212, 116, 86)";
                    default:
                        return "rgb(212, 116, 86)";
                }
            })
            .style("opacity", 0.3)
            .on("mouseover", (event, d) => {
                popup.html(`
                    <div style="color: rgb(212, 116, 86); font-weight: bold; font-size: 18px;">Address: ${d.address}</div>
                    <div style="color: white;">Typeology: ${d.Proptype}</div>
                    <div style="color: white;">Price: $${d.price}</div>
                    <div style="color: white;">Flood: $${d.nine}</div>
                `)
                .style("display", "block")
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", () => {
                popup.style("display", "none");
            });
        });
        });
    };

 updateScatterplot(currentMode);
