const { GH_PAT, GH_USERNAME } = require("../index").config;

module.exports = {
     assignUser(issue, repo, user) {
        return new Promise((resolve, rejects) => {
            const data = {
                method: "POST",
                headers: { Authorization: `${GH_USERNAME}:${GH_PAT}`},
                body: {}
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