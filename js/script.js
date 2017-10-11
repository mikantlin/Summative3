// config variables
const behanceAPI = 'TJWj9OP9YyUJxO7X1cD2Dovr6e5NeOWJ';
const portfolioVideoID = '110471927';
const photographers = ['tinapicardphoto','ilonaveresk','andrejosselin','Carlaveggio'];
const chartColours = ['#fec44f','#fe9929','#FF6138','#cc4c02'];

// chart functions
function makeBarChart(data, container, width, height) {
  // build a colour generator - d3 will map data to particular colours
  let colourGen = d3.scaleOrdinal(chartColours);

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
        .style('fill', function(d,i){ return colourGen(i) })
        
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
      .range(chartColours);

    // generators
    let pieDataGen = d3.pie()
            .sort(null)
            .value(function(d){ return d[stat] });

    let arcGen = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius / 2)
            .cornerRadius(0);

    let arcGenHover = d3.arc()
            .outerRadius(radius * 1.1)
            .innerRadius(radius / 1.9)
            .cornerRadius(0);
            
    let arcLabelGen = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius / 2);
  
    let pieData = pieDataGen(data);

    // creating the pie chart
    let pie = d3.select(container)
      .append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);
  
    pie.selectAll('.arc')
      .data(pieData)
      .enter()
      .append('path')
      .attr('id',function(d,i){ return 'arc'+i})
      .attr('class','arc')
      .attr('d',arcGen)
      .style('fill',function(d){ return colGen(d.data.name) })
      .on("mouseover", function(d) {
        d3.select(this).transition()
          .duration(300)
          .attr("d", arcGenHover);
      })
      .on("mouseout", function(d) {
        d3.select(this).transition()
          .duration(250)
          .attr("d", arcGen);
      });
  
    // values
    pie.selectAll('.size')
      .data(pieData)
      .enter()
      .append('text')
      .style('text-anchor','middle')
      .style('alignment-baseline','middle')
      .style('font-family','Verdana')
      .style('font-size','12')
      .attr('class','chart__label')
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
    .attr('class','fa fa-5x chart__title');
}

$(function() {
  $.fn.extend({
    exists: function() {
      return this.length > 0;
    }
  });

  // main page code
  if ($('main-page').exists()) {
    
  }

  // profile page code
  if ($('#profile').exists()) {

    // template functions
    function setUserTemplate() {
      let user = JSON.parse(sessionStorage.getItem('behanceUser'));

      let hero = heroTemplate(user);
      $('.hero').append(hero);
    
      let aboutBlurb = blurbTemplate(user);
      $('.blurb').append(aboutBlurb);
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
      let chartData = JSON.parse(sessionStorage.getItem('behanceStats'));

      makePieChart(chartData, stat, `#${stat}Chart`, 250, 250, 100);
    }

    function setLegend() {
      let legendData = JSON.parse(sessionStorage.getItem('behanceStats'));

      let $legend = $('.legend');
      legendData.forEach(function(d, i) {
        $legend.append(`<li style="background-color: ${chartColours[i]};></div> <span class="legend__text">${d.name}</span></li>`);
      });
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

    // set up portfolio video (referenced https://github.com/vimeo/player.js)
    let options = {
      id: portfolioVideoID,
      width: 640,
      loop: true,
      color: 'f15c25'
    };

    let player = new Vimeo.Player('featuredVideo', options);

    player.ready().then(function() {
      let $player = $('.video iframe');

      $player
      // attach video's aspect ratio
      .data('aspectRatio', $player.height() / $player.width())

      // and remove the hardcoded width/height
      .removeAttr('height')
      .removeAttr('width');

      $(window).resize(function() {
        
          let $container = $(".video");
          let newWidth = $container.width();
      
          // Resize video according to aspect ratio
          $player
            .width(newWidth)
            .height(newWidth * $player.data('aspectRatio'));
      }).resize();
    });

    // collect API responses for all the photographers
    let photographerURLs = [];
    if(sessionStorage.getItem('behanceStats')) {
      // just run charts
      setLegend();
      setChart('views');
      setChart('appreciations');
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
        setLegend();
        setChart('views');
        setChart('appreciations');
        setChart('followers');
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
        prevButton: '.swiper-button-prev',
        autoHeight: true
      })
    });

    let $spans = $('.card-link span');
    $spans.each(function(){
      $(this).parent().css({
      'height': ($(this).height() + 2) + 'px',
      'position':'relative',
      'overflow':'hidden'
      });
    });
    $spans.css({
      'position':'absolute',
      'top': '0',
      'left': '0',
      'right': '0'
    });
    $('.card-link').hover(function() {
      $(this).find('span').toggleClass('show');
    });
  }

});