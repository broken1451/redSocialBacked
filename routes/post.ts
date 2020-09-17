import { Router, Request, Response } from "express";
import { FileUpload } from "../interfaces/file";
import { verificaToken } from "../middlewares/auth";
import { Post } from "../models/post.model";

const postRouts = Router();

// Obtener post
postRouts.get("/", async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  // const post = await Post.find().sort({mensaje: 'asc'}).exec();
  const post = await Post.find()
    .sort({ _id: "desc" })
    .limit(10)
    .skip(skip)
    .populate("usuario", "avatar nombre email ")
    .exec();

  const postNumbers = await Post.count({});

  return res.json({
    ok: true,
    post: post,
    pagina,
    skip,
    postNumbers,
  });
});

// crear post
postRouts.post("/", verificaToken, (req: any, res: Response) => {
  const body = req.body;
  body.usuario = req.usuario._id;

  Post.create(body)
    .then(async (post) => {
      //  await post.populate("usuario", '-password').execPopulate(); // relacion con la tabla usuarios en la bd, esto hace referecia y toma esta relacion q esta en el modelo
      await post.populate("usuario", "avatar nombre email ").execPopulate(); // relacion con la tabla usuarios en la bd, esto hace referecia y toma esta relacion q esta en el modelo
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

// subir archivos
postRouts.put("/upload", [verificaToken], (req: any, res: Response) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No selecciono ningun archivo",
      errors: { message: "Debe seleccionar una imagen" },
    });
  }

  const file: FileUpload = req.files.image; //imagen es el nombre que esta en el postman

  if (!file) {
    return res.status(400).json({
      ok: false,
      mensaje: "No selecciono ningun archivo",
      errors: { message: "Debe seleccionar una imagen - image" },
    });
  }

  // validar que siempre sea una imagen
  console.log( "file.mimetype.includes(image): ",file.mimetype.includes("image")
  );
  if (!file.mimetype.includes("image")) {
    return res.status(400).json({
      ok: false,
      mensaje: "No selecciono ningun archivo",
      fileMineType: file.mimetype,
      errors: { message: "Debe seleccionar una imagen - image" },
    });
  }

  return res.status(200).json({
    ok: true,
    mensaje: "Se subio archivo",
    fileMineType: file.mimetype,
    file: file.mimetype.includes("image"),
  });
});

export default postRouts;
