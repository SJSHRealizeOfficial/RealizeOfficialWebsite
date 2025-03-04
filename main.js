import { GitHubRepoManager } from "./linkPreview.js";

$("header > nav > button").on("click", async (e) => {
  $("header > nav > button").css("font-weight", "normal");
  $(e.target).css("font-weight", "bold");
  $("contents").empty();
  const type = e.target.id;
  if (type === "project") {
    fetch("./data/projects.json")
      .then((response) => response.json())
      .then((json) => {
        $.each(json, (title, project) => {
          $("contents").append(`
                <div class="card">
            <img
              src="./img/${project.thumbnail}"
              alt="${title} thumbnail Image"
              class="thumbnail"
            />
            <h1 class="cardTitle">
              ${title}
            </h1>
            <p class="cardPeriod">${project.period}</p>
            </br>
            <p class="cardDescription">${project.description}</p></br>
            <p class="cardDescription"><b>프로젝트 팀장</b></br>${
              project.members[0]
            }</p>
            <p class="cardDescription"><b>주요 프로젝트 참여 인원</b></br>${project.members
              .slice(1)
              .join(", ")}...</p>
          </div>
              `);
        });
      });
  } else if (type == "source") {
    $("#source").css("font-weight", "bold");
    const manager = new GitHubRepoManager("container");

    // 여러 레포지토리 추가
    manager.addRepo("https://github.com/maruson08/pumpitup");
    manager.addRepo("https://github.com/maruson08/Simple_Controller");
    manager.addRepo("https://github.com/SJSHRealizeOfficial/RealizeOfficialWebsite");
  }
});
