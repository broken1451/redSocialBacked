import { Router, Request, Response } from "express";
import { FileUpload } from "../interfaces/file";
import { verificaToken } from "../middlewares/auth";
import { Post } from "../models/post.model";
import FileSystem from "../classes/fileSystem";

const postRouts = Router();
const fileSytem = new FileSystem();

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

  const imagenes = fileSytem.imagenesTempToPosts(req.usuario._id);
  body.imgs = imagenes;

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
postRouts.put("/upload", [verificaToken], async (req: any, res: Response) => {
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
  console.log("file.mimetype.includes(image): ", file.mimetype.includes("image"));
  if (!file.mimetype.includes("image")) {
    return res.status(400).json({
      ok: false,
      mensaje: "No selecciono ningun archivo",
      fileMineType: file.mimetype,
      errors: { message: "Debe seleccionar una imagen - image" },
    });
  }

  await fileSytem.guardarImagenTemporal(file, req.usuario._id);

  return res.status(200).json({
    ok: true,
    file,
    mensaje: "Se subio archivo",
    fileMineType: file.mimetype,
    usuario: req.usuario,
    // file: file.mimetype.includes("image"),
  });
});

postRouts.get("/imagen/:userId/:nombreImg", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const img = req.params.nombreImg;

  const pathPhoto: any = fileSytem.getPhotoUrl(userId, img);

  res.sendFile(pathPhoto);
});

//TODO HACER LA ACTUALIZACION DE UN POST  Y ELIMINAR POST

postRouts.delete("/delete/:idPost", [verificaToken], (req: any, res: Response) => {
    const user = req.usuario;
    const idPost = req.params.idPost;

    Post.findByIdAndRemove(idPost, (err, postDeleted) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error borrar post",
          errors: err,
        });
      }
      if (!postDeleted) {
        return res.status(400).json({
          ok: false,
          mensaje: "El usuario con el " + idPost + "no existe",
          // errors: err
          errors: { message: "No existe un usuario con ese ID" },
        });
      }

      return res.status(200).json({
        ok: true,
        postDeleted: postDeleted,
        idPost,
      });
    });
  }
);

export default postRouts;
