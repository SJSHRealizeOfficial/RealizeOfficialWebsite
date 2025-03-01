class GitHubRepoPreview {
  constructor(repoUrl) {
    this.repoUrl = repoUrl;
    this.element = document.createElement("div");
    this.element.classList.add("repo-container");
    this.languageColors = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      Go: "#00ADD8",
      Ruby: "#701516",
    };
  }

  async init() {
    this.showLoading();
    try {
      const data = await this.fetchRepoData();
      this.render(data);
    } catch (error) {
      this.showError(error.message);
    }
    return this.element;
  }

  showLoading() {
    this.element.innerHTML = `
      <div class="repo-preview loading">
        <div class="loading-bar" style="width: 70%"></div>
        <div class="loading-bar" style="width: 50%"></div>
      </div>
    `;
  }

  showError(message) {
    this.element.innerHTML = `
      <div class="error-message">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zm0-1A7 7 0 108 1a7 7 0 000 14zm-.5-6.5v-5h1v5h-1zm0 3v-1h1v1h-1z"/>
        </svg>
        Error loading repository: ${message}
      </div>
    `;
  }

  async fetchRepoData() {
    const [owner, repo] = this.repoUrl
      .replace("https://github.com/", "")
      .split("/");

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? "Repository not found"
          : "Failed to load repository"
      );
    }
    return response.json();
  }

  formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  }

  render(data) {
    const languageColor = this.languageColors[data.language] || "#333";

    this.element.innerHTML = `
      <div class="repo-preview">
        <div class="repo-header">
          <a href="${data.html_url}" class="repo-name" target="_blank">
            ${data.full_name}
          </a>
          <span class="repo-visibility">
            ${data.private ? "Private" : "Public"}
          </span>
        </div>
        
        <div class="repo-description">
          ${data.description || ""}
        </div>
        
        <div class="repo-stats">
          ${
            data.language
              ? `
            <div class="repo-stat">
              <span class="language-dot" style="background-color: ${languageColor}"></span>
              ${data.language}
            </div>
          `
              : ""
          }
          
          <div class="repo-stat">
            <svg aria-label="stars" height="16" viewBox="0 0 16 16" width="16">
              <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" fill="currentColor"></path>
            </svg>
            ${this.formatNumber(data.stargazers_count)}
          </div>
          
          <div class="repo-stat">
            <svg aria-label="forks" height="16" viewBox="0 0 16 16" width="16">
              <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" fill="currentColor"></path>
            </svg>
            ${this.formatNumber(data.forks_count)}
          </div>
        </div>
      </div>
    `;
  }
}

// GitHubRepoManager 클래스 추가
class GitHubRepoManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  async addRepo(repoUrl) {
    const preview = new GitHubRepoPreview(repoUrl);
    const element = await preview.init();
    this.container.appendChild(element);
  }

  // 모든 프리뷰 제거
  clearRepos() {
    this.container.innerHTML = "";
  }
}

export { GitHubRepoManager };
