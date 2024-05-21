class ViewB {
  #intraLabel;
  clicked = false;
  constructor(con, root, data) {
    this.con = con;

    const div = root
      .append("div")
      .style("position", "fixed")
      .style("top", "0")
      .style("right", "0")
      .style("width", "50%")
      .style("height", "100%")
      .style("overflow", "scroll");

    const svg = div
      .append("svg")
      .style("position", "relative")
      .style("width", "200%")
      .style("height", "800px");

    const conditionMap = {
      "new": 5,
      "like new": 4,
      "excellent": 3,
      "good": 2,
      "fair": 1,
      "salvage": 0
    };

    const revconditionMap = {
      "5": "new",
      "4": "like new",
      "3": "excellent",
      "2": "good",
      "1": "fair",
      "0": "salvage"
    };

    // Group the data by year and calculate the average price and condition for each year
    const yearData = d3.group(data, (d) => d.year);
    const yearAverages = Array.from(yearData, ([year, cars]) => ({
      year,
      averagePrice: d3.mean(cars, (d) => d.price),
      averageCondition: d3.mode(cars, (d) => conditionMap[d.condition]),
    }));


    // Create scales for the x and y axes
    const xScale = d3
      .scaleBand()
      .domain(yearAverages.map((d) => d.year))
      .range([0, innerWidth])
      .paddingInner(0.05) // add 20% padding between the bars
      .paddingOuter(0.5) // add 10% padding to the outer edges of the scale
      .padding(0.5);

    // Adjust the range of yScale to fit the increased height
    const yScale = d3
      .scaleLinear()
      .domain([5000, d3.max(yearAverages, (d) => d.averagePrice) * 1.2])
      .range([innerHeight * 0.9, 0]);

    // Add the y-axis to the bar chart
    svg.append("g").call(d3.axisLeft(yScale));

    // Add the bars to the bar chart and add some space between the bars
    svg
      .selectAll("rect")
      .data(yearAverages)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(d.averagePrice))
      .attr("width", xScale.bandwidth() * 2) // increase the width of the bars
      .attr("height", (d) => innerHeight * 0.9 - yScale(d.averagePrice)) // adjust the height of the bars
      .attr("fill", "#69b3a2")
      .on("mouseover", function (d) {
        d3.select(this).attr("fill", "#ff9800");
      })

      .on("mouseout", function (d) {
        if (!this.clicked) {
          d3.select(this).attr("fill", "#69b3a2");
        }
      })
      .on("click", function (d) {
        // Highlight the clicked bar
        d3.select(this).attr("fill", "lightblue");
        // If a rect is already clicked, deselect it
        if (this.clicked) {
          d3.select(this).attr("fill", "#69b3a2");
          // Call con.bToA with a blank string
          con.bToA("");
        } else {
          // Call con.bToA with the average condition
          con.bToA(revconditionMap[d.target.__data__.averageCondition]);
        }
        this.clicked = !this.clicked;
      });


    // Add a label to the x-axis
    svg
      .append("text")
      .attr("class", "axis-label") // add class here
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight - 30)
      .attr("text-anchor", "middle")
      .text("Year");

    // Add a label to the y-axis
    svg
      .append("text")
      .attr("class", "axis-label") // add class here
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 3)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .text("Average Price");

    // Add a label to the bars
    svg
      .selectAll(".bar-label")
      .data(yearAverages)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => xScale(d.year) + xScale.bandwidth() * 4)
      .attr("y", (d) => yScale(d.averagePrice))
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        (d) =>
          `rotate(-90, ${xScale(d.year) + xScale.bandwidth() / 2}, ${yScale(d.averagePrice) - 10
          })`
      ) // add rotation to the labels
      .text((d) => `$${d3.format(",")(Math.round(d.averagePrice))}`)
      .on("mouseover", function (d) {
        d3.select(this).text((d) => revconditionMap[d.averageCondition]);
      })
      .on("mouseout", function (d) {
        d3.select(this).text((d) => `${d3.format(",")(Math.round(d.averagePrice))}`)
      })
      .on("click", function (d) {
        if (this.clicked) {
          con.bToA("");
        }
        else {
          // Call con.bToA with the average condition
          con.bToA(revconditionMap[d.target.__data__.averageCondition]);
        }
        this.clicked = !this.clicked;
      });
  }
  Hear(str) {
    this.#intraLabel.text(str);
  }
}
