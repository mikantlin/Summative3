// config variables
const behanceAPI = 'TJWj9OP9YyUJxO7X1cD2Dovr6e5NeOWJ';
const photographers = ['tinapicardphoto','ilonaveresk','andrejosselin','Carlaveggio'];

// chart functions
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

function makePieChart(data, stat, container, width, height, radius){
  
    let colGen = d3.scaleOrdinal()
      .range(['#fec44f','#fe9929','#ec7014','#cc4c02','#993404','#662506']);

    // generators
    let pieDataGen = d3.pie()
            .sort(null)
            .value(function(d){ return d[stat] });

    let arcGen = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius/2)
            .cornerRadius(0);

    let arcLabelGen = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius/2);
  
    let pieData = pieDataGen(data);

    // creating the pie chart
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
      .style('fill','333')
      .attr('transform',function(d){ return `translate(${arcLabelGen.centroid(d)})` })
      .text(function(d){ return d.value.toLocaleString() });

    // title 
    pie.append('text')
    .text(function() {
      if (stat == 'appreciations') {
        return '\uf164';
      } else if (stat == 'comments') {
        return '\uf075';
      } else if (stat == 'followers') {
        return '\uf234';
      } else if (stat == 'views') {
        return '\uf06e';
      }
    })
    .attr("transform", `translate(0,0)`)
    .attr('text-anchor','middle')
    .attr('alignment-baseline','middle')
    .attr('font-size',30)
    .attr('class','fa fa-5x fa-thumbs-up')
    .style('fill','333');

    // tooltip

  
}

$(function() {
  // template functions
  function setUserTemplate() {
    let user = JSON.parse(sessionStorage.getItem('behanceUser'));

    let hero = heroTemplate(user);
    $('.hero').append(hero);
  
    let blurb = blurbTemplate(user);
    $('.blurb').append(blurb);
  }

  function setProjectsTemplate() {
    let projects = JSON.parse(sessionStorage.getItem('behanceUserProjects'));

    projects.forEach((project) => {
      let listItem = projectListTemplate(project);
      $('.projects').append(listItem);
    });
  }

  function setProjectDetailsTemplate(projectid, container) {
    let $container = container;
    $container.empty();

    let project = JSON.parse(sessionStorage.getItem(`behanceProjectDetails-${projectid}`));
    
    let output = modalTemplate(project);

    $container.append(output);
  }
  
  function setChart(stat) {
    let data = JSON.parse(sessionStorage.getItem('behanceStats'));
    console.log(data);
    
    makePieChart(data, stat, `#${stat}Chart`, 300, 300, 150);
  }
  
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

  // cache requests for session
  if(sessionStorage.getItem('behanceUser')) {
    setUserTemplate();
  } else {
    $.ajax({
        url: userURL,
        dataType: 'jsonp',
        success: function(res) {
          let data = JSON.stringify(res.user);
          sessionStorage.setItem('behanceUser', data);
          setUserTemplate();
        }
    });
  }

  let projectsURL = `https://api.behance.net/v2/users/${photographers[0]}/projects?client_id=${behanceAPI}`;

  if(sessionStorage.getItem('behanceUserProjects')) {
    setProjectsTemplate();
  } else {
    $.ajax({
        url: projectsURL,
        dataType: 'jsonp',
        success: function(res) {
          let data = JSON.stringify(res.projects);
          sessionStorage.setItem('behanceUserProjects', data);
          setProjectsTemplate();
        }
    });
  }

  // project modal popup
  $('#portfolioModal').on('show.bs.modal',function(e){

    let $projectContent = $('.project-content');
    $projectContent.empty();

    // grab project ID and build Behance API url
    let projectid = $(e.relatedTarget).data('projectid');
    let projectDetailsURL = `https://api.behance.net/v2/projects/${projectid}?client_id=${behanceAPI}`;

    if(sessionStorage.getItem(`behanceProjectDetails-${projectid}`)) {
      setProjectDetailsTemplate(projectid, $projectContent);
    } else {
      $.ajax({
          url: projectDetailsURL,
          dataType: 'jsonp',
          success: function(res) {
            let data = JSON.stringify(res.project);
            sessionStorage.setItem(`behanceProjectDetails-${projectid}`, data);
            setProjectDetailsTemplate(projectid, $projectContent);
          }
      });
    }
  });

  //initialize swiper when bootstrap modal is shown
  $('#portfolioModal').on('shown.bs.modal',function(e){
    let mySwiper = new Swiper('.swiper-container', {
      loop: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev'
    })
  });    

  // collect API responses for all the photographers
  let photographerURLs = [];
  if(sessionStorage.getItem('behanceStats')) {
    // just run charts
    setChart('views');
    setChart('appreciations');
    setChart('comments');
    setChart('followers');
  } else {
    // make the api call for each photographer
    photographers.forEach(function(photographer) {
      photographerURLs.push(
        $.ajax({
          localCache: true,
          url: `https://api.behance.net/v2/users/${photographer}?client_id=${behanceAPI}`,
          dataType: 'jsonp'
        })
      );
    });
    // once they're all done, store it in sessionStorage
    $.when(photographerURLs[0],photographerURLs[1],photographerURLs[2],photographerURLs[3]).done(function(...args) {
      let userStats = [];      
      args.forEach(function(res) {
        let user = res[0].user.stats;
        user.name = res[0].user.display_name;
        userStats.push(user);
      });
      let data = JSON.stringify(userStats);
      sessionStorage.setItem('behanceStats', data);

      // after it's stored, run charts
      setChart('views');
      setChart('appreciations');
      setChart('comments');
      setChart('followers');
    });
  }
});