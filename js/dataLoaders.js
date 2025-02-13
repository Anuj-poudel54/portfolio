
const worksWrapper = document.querySelector(".works-wrapper");
const projectWrapper = document.querySelector(".project-wrapper");

function addWorkNdProjects(wrapper, { title, imageName, desc, githubLink = null, webLink = null }) {
    let htmlSkeleton = `<div class="col-lg-4 col-md-6"> <div class="single_service text-center"> <div class="icon"> <img width="300px" src="{{image_name}}" alt=""> </div> <h3> {{title}} </h3> <p>{{desc}}</p> <div class="buttons d-flex justify-content-center mt-2"> <a target="_blank"href="{{github_link}}" class="btn btn-outline {{github_classes}}"><i class="fa fa-github fa-lg" style="color: #DB9A64;"></i> </a> <a target="_blank"href="{{web_link}}" class="btn btn-outline {{web_classes}}"><i class="fa fa-link fa-lg" style="color: #DB9A64;"></i> </a> </div> </div>`;

    htmlSkeleton = htmlSkeleton.replace("{{title}}", title);
    htmlSkeleton = htmlSkeleton.replace("{{desc}}", desc);
    htmlSkeleton = htmlSkeleton.replace("{{image_name}}", "/img/workproject/" + imageName);

    if (githubLink !== null) {
        htmlSkeleton = htmlSkeleton.replace("{{github_link}}", githubLink);
        htmlSkeleton = htmlSkeleton.replace("{{github_classes}}", "");
    }
    else {
        htmlSkeleton = htmlSkeleton.replace("{{github_link}}", "#");
        htmlSkeleton = htmlSkeleton.replace("{{github_classes}}", "disabled");
    }

    if (webLink !== null) {
        htmlSkeleton = htmlSkeleton.replace("{{web_link}}", webLink);
        htmlSkeleton = htmlSkeleton.replace("{{web_classes}}", "");
    }
    else {
        htmlSkeleton = htmlSkeleton.replace("{{web_link}}", "#");
        htmlSkeleton = htmlSkeleton.replace("{{web_classes}}", "disabled");
    }

    wrapper.innerHTML += htmlSkeleton;
}

fetch(dataFile, { method: "GET" })
    .then(res => res.json())
    .then(data => {
        console.log("Data received, rendering...");
        const works = data['works'];
        const projects = data['projects'];

        for (let work of works) {
            addWorkNdProjects(worksWrapper, work);
        }
        for (let proj of projects) {
            addWorkNdProjects(projectWrapper, proj);
        }
    })
    .catch(err => console.log(err))
