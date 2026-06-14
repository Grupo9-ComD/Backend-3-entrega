import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    console.log("ENTRÉ A /chat");
    console.log("Usuario:", res.locals.usuario);

    res.render("chat");
});

export default router;