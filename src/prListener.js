const { router, config } = require("../index");

router.post("/webhook/pull_request", (req, res) => {
    if (isPing(req.body)) {
        res.status(200).json("200: All clear !");
    } else if (checkParams(req.body)) {

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
