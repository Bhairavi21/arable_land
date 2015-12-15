d3.json("json/reqOne1.json", function(data) {
  //data.sort(function(a,b){return b.land-a.land;});
  var pxAboveBar=10;
var svgHeight = 550;
var svgWidth = 1100;
var maxland =d3.max(data,function(d){return d.land;}); // You can also compute this from the data
var barSpacing = 1; // The amount of space you want to keep between the bars
var padding = {
    left: 20, right: 0,
    top: 20, bottom: 100
};
function animateBarsUp() {
  var maxWidth = svgWidth - padding.left - padding.right;
  var maxHeight = svgHeight - padding.top - padding.bottom;

  // Define your conversion functions
  var convert = {
    x: d3.scale.ordinal(),
    y: d3.scale.linear()
  };

  // Define your axis
  var axis = {
    x: d3.svg.axis().orient('bottom'),
    y: d3.svg.axis().orient('left')
  };

  // Define the conversion function for the axis points
  axis.x.scale(convert.x);
  axis.y.scale(convert.y);

  // Define the output range of your conversion functions
  convert.y.range([maxHeight, 0]);
  convert.x.rangeRoundBands([0, maxWidth]);

  // Once you get your data, compute the domains
  convert.x.domain(data.map(function (d) {
      return d.year;
    })
  );
  convert.y.domain([0, maxland]);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Percentage:</strong> <span>" + d.land + "</span>";
    })

  // Setup the markup for your SVG
  var svg = d3.select('.chart')
    .attr({
        width: svgWidth,
        height: svgHeight
    });
    svg.call(tip);

  // The group node that will contain all the other nodes
  // that render your chart
  var chart = svg.append('g')
    .attr({
        transform: function (d, i) {
          return 'translate(' + padding.left + ',' + padding.top + ')';
        }
      });

  chart.append('g') // Container for the axis
    .attr({
      class: 'x axis',
      transform: 'translate(0,' + maxHeight + ')',

    })
    .call(axis.x)
    .selectAll("text")
    .attr("transform","rotate(-60)")
    .attr("dx","-.8em")
    .attr("dy",".25em")
    .style("text-anchor","end");
  chart.append('g') // Container for the axis
    .attr({
      class: 'y axis',
      height: maxHeight
    })
    .call(axis.y)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-3.00em")
      .attr("dx","-.5em")
      .style("text-anchor", "end")
      .style("font-size","15px")
      .text("% of land area");
; // Insert an axis inside this node

  var bars = chart
    .selectAll('g.bar-group')
    .data(data)
    .enter()
    .append('g') // Container for the each bar
    .attr({
      transform: function (d, i) {
        return 'translate(' + convert.x(d.year) + ', 0)';
      },
      class: 'bar-group'
    });

  bars.append('rect')
        .attr({
        y: maxHeight,
        height: 0,
        width: function(d) {return convert.x.rangeBand(d) - 1;},
        class: 'bar'
    })
    .transition()
    .duration(1500)
    .attr({
      y: function (d, i) {
        return convert.y(d.land);
      },
      height: function (d, i) {
        return maxHeight - convert.y(d.land);
      }
    });

    chart.selectAll('rect')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  return chart;
}

animateBarsUp();

})
