const { router, config } = require("../index");

router.post("/webhook/pull_request", (req, res) => {
    if (isPing(req.body)) {

        res.status(200).json({ message: "200: All clear !" });

    } else if (checkParams(req.body)) {

        if (config.ALLOWED_REPOSITORIES.indexOf(req.body.repository.full_name) < 0) return res.status(403).json({ message: "403: Forbidden" });

        let assignee = config.REVIEWERS[Math.floor(Math.random() * config.REVIEWERS.length)];
        while (req.body.pull_request.user.login == assignee) {
            config.REVIEWERS[Math.floor(Math.random() * config.REVIEWERS.length)];
        }

        console.log(assignee)
        
        res.status(200).json({ message: "200: All clear !" });

    } else return res.status(400).json({ message: "400: Bad Request" });
});

function isPing(body) {
    if (body.zen == undefined) return false;
    if (body.hook_id == undefined) return false;
    if (body.repository == undefined) return false;
    
    return true;
}

function checkParams(body) {
    if (body.action == undefined) return false;
    if (body.pull_request == undefined) return false;
    if (body.repository == undefined)  return false;

    return true;
}