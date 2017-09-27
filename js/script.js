const behanceAPI = 'TJWj9OP9YyUJxO7X1cD2Dovr6e5NeOWJ';
const photographers = ['tinapicardphoto','ilonaveresk','andrejosselin','Carlaveggio'];

$(function() {

  // Template7 templates
  let heroHTML = $('#hero-template').text();
  let heroTemplate = Template7(heroHTML).compile();

  let blurbHTML = $('#blurb-template').text();
  let blurbTemplate = Template7(blurbHTML).compile();

  let projectListHTML = $('#project-list-template').text();
  let projectListTemplate = Template7(projectListHTML).compile();  
  
  let modalHTML = $('#modal-template').text();
  let modalTemplate = Template7(modalHTML).compile();

  // get user info
  let userURL = `https://api.behance.net/v2/users/${photographers[0]}?client_id=${behanceAPI}`;
  console.log(userURL);
 
  $.ajax({
    localCache: true,
    url: userURL,
    dataType: 'jsonp',
    success: (res) => {

      let data = res.user;

      let hero = heroTemplate(data);
      $('.hero').append(hero);

      let blurb = blurbTemplate(data);
      $('.blurb').append(blurb);
      
      let projectsURL = `https://api.behance.net/v2/users/${photographers[0]}/projects?client_id=${behanceAPI}`;
      console.log(projectsURL);

      $.ajax({
        localCache: true,
        url: projectsURL,
        dataType: 'jsonp',
        success: (res) => {
          let projects = res.projects;

          projects.forEach((project) => {
            let listItem = projectListTemplate(project);
            $('.projects').append(listItem);
          });
        }
      });

    }
  });

  // project modal popup
  $('#portfolioModal').on('show.bs.modal',function(e){

    let $projectContent = $('.project-content');
    $projectContent.empty();

    // grab project ID and build Behance API call url
    let projectid = $(e.relatedTarget).data('projectid');
    let urlProject = `https://api.behance.net/v2/projects/${projectid}?client_id=${behanceAPI}`;

    console.log(urlProject);
    $.ajax({
      localCache: true,
      url: urlProject,
      dataType: 'jsonp',
      success: function(res) {
        let project = res.project;

        let output = modalTemplate(project);

        $projectContent.append(output);

      }
    });

  });

  $('#portfolioModal').on('shown.bs.modal',function(e){
    //initialize swiper when document ready  
    var mySwiper = new Swiper('.swiper-container', {
      loop: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev'
    })
  });    

  // collect API responses for all the photographers
  let photographerStats = [];
  let allViews = [];

  // photographers.forEach(function(photographer) {
  //   photographerStats.push(
  //     $.ajax({
  //       localCache: true,
  //       url: `https://api.behance.net/v2/users/${photographer}?client_id=${behanceAPI}`,
  //       dataType: 'jsonp'
  //     })
  //   );
  // });

  // $.when(photographerStats[0],photographerStats[1],photographerStats[2],photographerStats[3]).done(function(...args) {
  //   args.forEach(function(res) {
  //     let user = res[0].user;
  //     allViews.push({name: user.display_name, value: user.stats.views});
  //   });
  
  //   makePieChart(allViews, '#chart', 300, 300, 150);
  // });

  // dummy data for setup - comment this out for live presentation
  allViews = [
    {
      name: 'Tina Picard',
      value: 126361
    },
    {
      name: 'Ilona D.Veresk',
      value: 140679
    },
    {
      name: 'André Josselin',
      value: 1299503
    },
    {
      name: 'Carl Warner',
      value: 254803
    },
  ];

  // makeBarChart(allViews, '#chart', 300, 300);
  makePieChart(allViews, '#chart', 300, 300, 150);
});

function makeBarChart(data, container, width, height) {
  // build a colour generator - d3 will map data to particular colours
  // let colourGen = d3.scaleOrdinal(d3.schemeSet2);

  let minMax = d3.extent(data,function(d){ return d.value});

  let yScale = d3.scaleLinear()
    .domain(minMax)
    .range([50,250]);

  let chart = d3.select(container)
  .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .append('g')
      .attr('transform','translate(15,25)')
      .attr('id','statsGroup');

  let bars = chart.selectAll('rect').data(data);
  
  bars.enter()
      .append('rect')
  
        // set colour
        // .style('fill', function(d,i){ return colourGen(i) })
        .style('fill', 'darkorange')
        
        // set initial states for x, y coordinates, width and height
        .attr('class','bar')
        .attr('x', function(d,i) { return i * 70 })
        .attr('y', 250)
        .attr('width', 50)
        .attr('height', 0)
  
        .transition()
        .duration(1000)
  
        // transition end states
        .attr('y', function(d) { return 250 - yScale(d.value) })
        .attr('height', function(d) { return yScale(d.value) });
  
  // labels
  let names = chart.selectAll('.name').data(data);
  
  names.enter()
    .append('text')
    .style('alignment-baseline', 'hanging')
    .style('text-anchor', 'middle')
    .style('font-family', 'Verdana')
    .style('font-size', '8')
    .text(function(d){ return d.name})
    .attr('class','name')
    .attr('y',255)
    .attr('x',function(d,i){ return i* 70 + 25});

  // values
  let values = chart.selectAll('.value').data(data);
  
  values.enter()
    .append('text')
    .style('alignment-baseline', 'hanging')
    .style('text-anchor', 'middle')
    .style('font-family', 'Verdana')
    .style('font-size', '8')
    .style('font-weight', 'bold')
    .style('color','white')
    .text(function(d){ return d.value.toLocaleString() })
    .attr('class','value')
    .attr('y', function(d) { return 260 - yScale(d.value) })
    .attr('x',function(d,i) { return i* 70 + 25});

}

function makePieChart(data, container, width, height, radius){
  
    let colGen = d3.scaleOrdinal()
      .range(['#B4B9DF','#B95095','#71417F','#E2A1DB','#E3CBFD']);

    // generators
    let pieDataGen = d3.pie()
            .sort(null)
            .value(function(d){ return d.value });
    let arcGen = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius/2)
            .cornerRadius(2);
    let arcLabelGen = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius/2);
  
    let pieData = pieDataGen(data);

    let pie = d3.select(container)
      .append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .append('g')
          .attr('transform', `translate(${radius},${radius})`);
  
    pie.selectAll('.arc')
      .data(pieData)
      .enter()
      .append('path')
      .attr('id',function(d,i){ return 'arc'+i})
      .attr('class','arc')
      .attr('d',arcGen)
      .attr('fill',function(d){ return colGen(d.data.name) })
  
    // values
    pie.selectAll('.size')
      .data(pieData)
      .enter()
      .append('text')
      .style('text-anchor','middle')
      .style('alignment-baseline','middle')
      .style('font-family','Verdana')
      .style('font-size','12')
      .attr('transform',function(d){ return `translate(${arcLabelGen.centroid(d)})` })
      .text(function(d){ return d.data.value.toLocaleString() });
  
  }