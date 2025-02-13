
const worksWrapper = document.querySelector(".works-wrapper");
const projectWrapper = document.querySelector(".project-wrapper");

function addWorkNdProjects(wrapper, title, imageName, desc, githubLink = null, websiteLink = null) {
    const htmlSkeleton = `<div class="col-lg-4 col-md-6"> <div class="single_service text-center"> <div class="icon"> <img src="{{image_name}}" alt=""> </div> <h3> {{title}} </h3> <p>{{desc}}</p> <div class="buttons d-flex justify-content-center mt-2"> <a href="{{github_link}}" class="btn btn-outline {{github_classes}}"><i class="fa fa-github fa-lg" style="color: #DB9A64;"></i> </a> <a href="{{web_link}}" class="btn btn-outline {{web_classes}}"><i class="fa fa-link fa-lg" style="color: #DB9A64;"></i> </a> </div> </div>`;

    htmlSkeleton = htmlSkeleton.replace("{{title}}", title);
    htmlSkeleton = htmlSkeleton.replace("{{desc}}", desc);
    htmlSkeleton = htmlSkeleton.replace("{{image_name}}", imageName);

    if (githubLink !== null) {
        htmlSkeleton = htmlSkeleton.replace("{{github_link}}", githubLink);
        htmlSkeleton = htmlSkeleton.replace("{{github_classes}}", "");
    }
    else {
        htmlSkeleton = htmlSkeleton.replace("{{github_link}}", "#");
        htmlSkeleton = htmlSkeleton.replace("{{github_classes}}", "disabled");
    }

    if (websiteLink !== null) {
        htmlSkeleton = htmlSkeleton.replace("{{web_link}}", websiteLink);
        htmlSkeleton = htmlSkeleton.replace("{{web_classes}}", "");
    }
    else {
        htmlSkeleton = htmlSkeleton.replace("{{web_link}}", "#");
        htmlSkeleton = htmlSkeleton.replace("{{web_classes}}", "disabled");
    }

    wrapper.innerHtml += htmlSkeleton;
}
