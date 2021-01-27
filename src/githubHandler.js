const { GH_PAT } = require("../index").config;
const fetch = require("node-fetch");

module.exports = {
     assignUser(issue, repo, user) {
        let assignees = [];
        assignees[0] = user;
        return new Promise((resolve, rejects) => {
            const data = {
                method: "POST",
                headers: { accept: 'application/vnd.github.v3+json', authorization: `token ${GH_PAT}` },
                body: JSON.stringify({ assignees: assignees })
            };
            fetch(`https://api.github.com/repos/${repo}/issues/${issue}/assignees`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.documentation_url != undefined) rejects(json);
                    resolve(json);
                });
        });
    },

    requestReview(pull, repo, user) {
        return new Promise((resolve, rejects) => {
            const data = {
                method: "POST",
                headers: { accept: 'application/vnd.github.v3+json', authorization: `token ${GH_PAT}` },
                body: JSON.stringify({ reviewers: [ user ] })
            };
            fetch(`https://api.github.com/repos/${repo}/pulls/${pull}/requested_reviewers`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.documentation_url != undefined) rejects(json);
                    resolve(json);
                });
        });
    }

}