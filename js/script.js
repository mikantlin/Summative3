const behanceAPI = 'TJWj9OP9YyUJxO7X1cD2Dovr6e5NeOWJ';
const username = 'tinapicardphoto';
const otherUser2 = 'ilonaveresk'; 
const otherUser3 = 'andrejosselin'; 
const otherUser4 = 'Carlaveggio';

$(function() {

  // Template7 templates
  let heroHTML = $('#hero-template').text();
  let heroTemplate = Template7(heroHTML).compile();

  let blurbHTML = $('#blurb-template').text();
  let blurbTemplate = Template7(blurbHTML).compile();

  let projectListHTML = $('#project-list-template').text();
  let projectListTemplate = Template7(projectListHTML).compile();  
  
  // jquery coding inside this function
  let userURL = `https://api.behance.net/v2/users/${username}?client_id=${behanceAPI}`;
  console.log(userURL);
  
/*
  $.ajax({
    cache: true,
    url: userURL,
    dataType: 'jsonp',
    success: (res) => {

      let data = res.user;

      let hero = heroTemplate(data);
      $('.hero').append(hero);

      let blurb = blurbTemplate(data);
      $('.blurb').append(blurb);
      
      let projectsURL = `https://api.behance.net/v2/users/${username}/projects?client_id=${behanceAPI}`;
      console.log(projectsURL);

      $.ajax({
        cache: true,
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
*/

  var skills = [
    {name: 'HTML',value: 90},
    {name: 'CSS',value: 85},
    {name: 'Design',value: 70},
    {name: 'UX',value: 60},
    {name: 'JS',value: 65},
  ];
  
  // chart stuff
  // build a colour generator - d3 will map data to particular colours
  let colourGen = d3.scaleOrdinal(d3.schemeSet2);
  
  // select a chart
  var chart = d3.select('#compare')
                .append('g')
                  .attr('transform','translate(25,25)');
  
  var bars = chart.selectAll('rect').data(skills);
  
  bars.enter()
      .append('rect')
  
        // set colour
        .style('fill', function(d,i){ return colourGen(i) })
  
        // set initial states for x, y co-ordinates, width and height
        .attr('class','bar')
        .attr('x', function(d,i) { return i * 30 })
        .attr('y', 25)
        .attr('width', 20)
        .attr('height', function(d) { return d.value});
  
        // .transition()
        // .duration(1000)
  
        // // transition end states
        // .attr('y', function(d) { return 300 - d.value * 5 })
        // .attr('height', function(d) { return d.value * 5 });
});

