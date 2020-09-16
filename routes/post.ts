import { Router, Request, Response } from "express";
import { verificaToken } from "../middlewares/auth";
import { Post } from "../models/post.model";

const postRouts = Router();

// nuevo post
postRouts.post("/", verificaToken, (req: any, res: Response) => {
  const body = req.body;
  body.usuario = req.usuario._id;

  Post.create(body)
    .then(async (post) => {
    
    //  await post.populate("usuario", '-password').execPopulate(); // relacion con la tabla usuarios en la bd, esto hace referecia y toma esta relacion q esta en el modelo
      await post.populate("usuario", 'avatar nombre email ').execPopulate(); // relacion con la tabla usuarios en la bd, esto hace referecia y toma esta relacion q esta en el modelo
      return res.json({
        ok: true,
        body: body,
        post: post,
      });
    })
    .catch((err) => {
      return res.json({
        ok: false,
        err: err,
      });
    });
});

export default postRouts;
