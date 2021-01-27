const { router, config } = require("../index");
const { requestReview } = require("./githubHandler");

router.post("/webhook/pull_request", async (req, res) => {
    if (isPing(req.body)) {

        res.status(200).json({ message: "200: All clear !" });

    } else if (checkParams(req.body)) {

        if (config.ALLOWED_REPOSITORIES.indexOf(req.body.repository.full_name) < 0) return res.status(403).json({ message: "403: Forbidden" });

        let assignee = config.REVIEWERS[Math.floor(Math.random() * config.REVIEWERS.length)];
        while (req.body.pull_request.user.login == assignee) {
            config.REVIEWERS[Math.floor(Math.random() * config.REVIEWERS.length)];
        }

        let isOK = true;
        await requestReview(req.body.number, req.body.repository.full_name, assignee)
            .then(() => {})
            .catch(error => { isOK = false; res.status(500).json({ message: "500: Internal Server Error", error: error }); });
        if (isOK == true) res.status(200).json({ message: "200: All clear" });
      
    } else return res.status(400).json({ message: "400: Bad Request" });
});

function isPing(body) {
    if (body.zen == undefined) return false;
    if (body.hook_id == undefined) return false;
    if (body.repository == undefined) return false;
    
    return true;
}

function checkParams(body) {
    if (body.action != "opened") return false;
    if (body.pull_request == undefined) return false;
    if (body.repository == undefined)  return false;

    return true;
}