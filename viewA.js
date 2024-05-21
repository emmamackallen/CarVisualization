class ViewA {
    #intraLabel;
    filter = "";
    averages;
    svg;

    constructor(con, root, data) {
        this.con = con;
        this.#intraLabel = d3.select("#label"); // assign a private variable for later use

        // create the container div for the heatmap
        const div = root
            .append("div")
            .style("position", "fixed")
            .style("top", "0")
            .style("left", "0")
            .style("width", "50%")
            .style("height", "100%")
            .style("overflow", "scroll");

        // create the SVG element for the heatmap
        const svg = div
            .append("svg")
            .style("position", "relative")
            .style("left", "10")
            .style("top", "20")
            .style("width", "125%")
            .style("height", "125%");

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

        // group the data by region and calculate the average car condition for each region
        const regionData = d3.group(data, (d) => d.region);
        const regionAverages = Array.from(regionData, ([region, cars]) => ({
            region,
            average: d3.mode(cars, (d) => conditionMap[d.condition]),
        }));
        this.averages = regionAverages;

        // create a scale for the color of the heatmap based on the average car condition
        const colorScale = d3
            .scaleSequential()
            .interpolator(d3.interpolateViridis)
            .domain([
                d3.min(regionAverages, (d) => d.average),
                d3.max(regionAverages, (d) => d.average),
            ]);

        // create a rectangle for each region in the heatmap
        svg
            .selectAll("rect")
            .data(() => {
                return regionAverages.filter((dp) => {
                    if (this.filter.length === 0) {
                        return dp;
                    }
                    else {
                        return revconditionMap[dp.average] === this.filter;
                    }
                }
                )
            })
            .enter()
            .append("rect")
            .attr("x", (d, i) => (i % 18) * 40)
            .attr("y", (d, i) => Math.floor(i / 18) * 40)
            .attr("width", 30)
            .attr("height", 30)
            .attr("fill", (d) => colorScale(d.average))
            .on("mouseover", function (d) {
                // add tooltip text when the mouse hovers over a rectangle
                d3.select(this)
                    .append("text")
                    .attr("x", (d, i) => (i % 18) * 40)
                    .attr("y", (d, i) => Math.floor(i / 18) * 40)
                    .attr("fill", "black")
                    .text((d) => d.region);
            })
            .on("mouseout", function (d) {
                // remove tooltip text when the mouse moves away from a rectangle
                d3.select(this).select("text").remove();
            })
            .append("title") // add a title element for the tooltip
            .text((d) => `${d.region}, Avg. Condition: ${revconditionMap[d.average]}`); // set the title text to the region and average condition

        // add a title to the heatmap
        svg
            .append("text")
            .attr("x", "40%")
            .attr("y", "90%")
            .attr("text-anchor", "middle")
            .text("Region with Average Car Condition Heat Map");

        this.svg = svg;
    }

    Hear(str) {
        this.#intraLabel.text(str);
    }

    Filter(str) {
        this.filter = str;

        const revconditionMap = {
            "5": "new",
            "4": "like new",
            "3": "excellent",
            "2": "good",
            "1": "fair",
            "0": "salvage"
        };

        // create a scale for the color of the heatmap based on the average car condition
        const colorScale = d3
            .scaleSequential()
            .interpolator(d3.interpolateViridis)
            .domain([
                d3.min(this.averages, (d) => d.average),
                d3.max(this.averages, (d) => d.average),
            ]);

        this.svg
            .selectAll("rect")
            .remove()

        // create a rectangle for each region in the heatmap
        this.svg
            .selectAll("rect")
            .data(() => {
                return this.averages.filter((dp) => {
                    if (this.filter.length === 0) {
                        return dp;
                    }
                    else {
                        return revconditionMap[dp.average] === this.filter;
                    }
                }
                )
            })
            .enter()
            .append("rect")
            .attr("x", (d, i) => (i % 18) * 40)
            .attr("y", (d, i) => Math.floor(i / 18) * 40)
            .attr("width", 30)
            .attr("height", 30)
            .attr("fill", (d) => colorScale(d.average))
            .on("mouseover", function (d) {
                // add tooltip text when the mouse hovers over a rectangle
                d3.select(this)
                    .append("text")
                    .attr("x", (d, i) => (i % 18) * 40)
                    .attr("y", (d, i) => Math.floor(i / 18) * 40)
                    .attr("fill", "black")
                    .text((d) => d.region);
            })
            .on("mouseout", function (d) {
                // remove tooltip text when the mouse moves away from a rectangle
                d3.select(this).select("text").remove();
            })
            .append("title") // add a title element for the tooltip
            .text((d) => `${d.region}, Avg. Condition: ${revconditionMap[d.average]}`); // set the title text to the region and average condition
    }

    filterData(data, condition) {
        const revconditionMap = {
            "5": "new",
            "4": "like new",
            "3": "excellent",
            "2": "good",
            "1": "fair",
            "0": "salvage"
        };
        if (!condition) {
            // If the condition is not defined, return all data
            return data;
        } else {
            // Filter the data based on the condition
            return data.filter(function (d) {
                return revconditionMap[d.average] === condition;
            });
        }
    }

}

