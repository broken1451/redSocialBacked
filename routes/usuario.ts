import { Router, Request, Response } from "express";
import { Usuario } from "../models/user.model";
import bcrypt from "bcrypt";

const userRoutes = Router();

userRoutes.get("/prueba", (req: Request, res: Response) => {
  return res.json({
    ok: true,
    mensaje: "Todo funciona bien",
  });
});

// crear user
userRoutes.post("/create", (req: Request, res: Response) => {
  const user = {
    nombre: req.body.nombre,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar,
  };

  // crear bd de mongo
  Usuario.create(user)
    .then((userDB) => {
      return res.status(201).json({
        ok: true,
        mensaje: "Todo funciona bien en post",
        user: userDB,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        err,
      });
    });
});

//Login
userRoutes.post("/login", (req: Request, res: Response) => {
  const body = req.body;

  Usuario.findOne({ email: body.email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: { message: "Error no se encuentra usuario" },
      });
    }

    if (!user) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas",
        // errors: {message:'Error no se encuentra email: ' + body.email +  ' asociado'}
        errors: { message: "Error no se encuentra email asociado" },
      });
    }
    
    // otra manera de comparar clave 
    if (user.compararClave(body.password)) {
      return res.status(200).json({
        ok: true,
        token: "avb123456",
      });
    } else {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas",
        // errors: {message:'Error no se encuentra email: ' + body.email +  ' asociado'}
        errors: { message: "Error no coincide la clave" },
      });
    }
  });
});

export default userRoutes;
