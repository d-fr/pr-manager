const { router, config } = require("../index");
const { requestReview, assignUser, postComment } = require("./githubHandler");

router.post("/webhook/pull_request", async (req, res) => {
    if (isPing(req.body)) {

        res.status(200).json({ message: "200: All clear !" });

    } else if (checkParams(req.body)) {

        if (config.ALLOWED_REPOSITORIES.indexOf(req.body.repository.full_name) < 0) return res.status(403).json({ message: "403: Forbidden" });
        
        if (config.VACATION_NOTICE.ENABLED) {
            let isOK = true
            await postComment(req.body.number, req.body.repository.full_name, config.VACATION_NOTICE.MESSAGE)
                .catch(error => { isOK = false; res.status(500).json({ message: "500: Internal Server Error", error: error }); console.log("ERROR: " + error.message) });
            if (isOK) res.status(200).json({ message: "200: All Clear" });
            return;

        }
        
        let assignee = config.REVIEWERS[Math.floor(Math.random() * config.REVIEWERS.length)];
        while (req.body.pull_request.user.login.toLowerCase() == assignee) {
            assignee = config.REVIEWERS[Math.floor(Math.random() * config.REVIEWERS.length)];
        }

        let isOK = true;
        await requestReview(req.body.number, req.body.repository.full_name, assignee)
            .then(() => assignUser(req.body.number, req.body.repository.full_name, assignee))
            .catch(error => { isOK = false; res.status(500).json({ message: "500: Internal Server Error", error: error }); console.log("ERROR: " + error.message) });
        
        if (config.IMPORTANT_NOTICE.ENABLED) {
            
            await postComment(req.body.number, req.body.repository.full_name, config.IMPORTANT_NOTICE.MESSAGE)
                .catch(error => { res.status(500).json({ message: "500: Internal Server Error", error: error }); console.log("ERROR: " + error.message) });
            res.status(200).json({ message: "200: All Clear" });
            return;

        }

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