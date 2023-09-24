import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Chart} from 'chart.js';
import * as d3 from 'd3';


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private http: HttpClient)
  {

  }

  //chart.js work*******************************************
  public dataSource: any= {
    datasets: [
        {
            data: [],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
            ]
        }
    ],
    labels: []
};

private data = [
  {"Budget": "Grocery", "Stars": "13", "Released": "2014"},
  {"Budget": "Food", "Stars": "150", "Released": "2013"},
  {"Budget": "Toys", "Stars": "62", "Released": "2016"},
];

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget').
    subscribe((res: any) => { 

      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
        this.createChart();
    }
    });
    this.createSvg();
    this.createColors();
    this.drawChart();
  }

  createChart() {
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
}
//end of chart.js*************************************

//d3 pie chart work
//https://blog.logrocket.com/data-visualization-angular-d3-js/
//i used this resource for me to implement the d3 chart. I was not able to use dynamic data for this

private svg: any;
private margin = 50;
private width = 750;
private height = 600;

private radius = Math.min(this.width, this.height) / 2 - this.margin;
private colors:any;

private createSvg(): void {
  this.svg = d3.select("figure#pie")
  .append("svg")
  .attr("width", this.width)
  .attr("height", this.height)
  .append("g")
  .attr(
    "transform",
    "translate(" + this.width / 2 + "," + this.height / 2 + ")"
  );
}

private createColors(): void {
  this.colors = d3.scaleOrdinal()
  .domain(this.data.map(d => d.Stars.toString()))
  .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
}

private drawChart(): void {
  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.Stars));

  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(this.radius)
  )
  .attr('fill', (d: any, i: any) => (this.colors(i)))
  .attr("stroke", "#121926")
  .style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('text')
  .text((d: any)=> d.data.Budget)
  .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
}

}
