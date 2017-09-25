const behanceAPI = 'TJWj9OP9YyUJxO7X1cD2Dovr6e5NeOWJ';
const username = 'tinapicardphoto';

$(function() {

  // Template7 templates
  let blurbHTML = $('#blurb-template').text();
  let blurbTemplate = Template7(blurbHTML).compile();

  let projectListHTML = $('#project-list-template').text();
  let projectListTemplate = Template7(projectListHTML).compile();  
  
  // jquery coding inside this function
  let userURL = `https://api.behance.net/v2/users/${username}?client_id=${behanceAPI}`;
  console.log(userURL);
  
  $.ajax({
    cache: true,
    url: userURL,
    dataType: 'jsonp',
    success: (res) => {

      let data = res.user;

      let user = {
        name: data.display_name,
        location: data.location,
        descriptions: data.sections,
        headshot: Object.values(data.images).pop()
      };

      $('.hero__name').text(user.name);

      let blurb = blurbTemplate(user);
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
});