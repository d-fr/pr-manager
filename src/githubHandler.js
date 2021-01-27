const { GH_PAT, GH_USERNAME } = require("../index").config;
const fetch = require("node-fetch");

module.exports = {
     assignUser(issue, repo, user) {
        return new Promise((resolve, rejects) => {
            const data = {
                method: "POST",
                headers: { accept: 'application/vnd.github.v3+json', authorization: `${GH_USERNAME}:${GH_PAT}` },
                body: JSON.stringify({ assignees: [ user ] })
            };
            fetch(`https://api.github.com/repos/${repo}/issues/${issue}/assignees`, data)
                .then(response => response.json())
                .then(json => {
                    console.log(json);
                    resolve(json);
                });
        });
    }
}