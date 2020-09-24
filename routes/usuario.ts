import { Router, Request, Response } from "express";
import { Usuario } from "../models/user.model";
import bcrypt from "bcrypt";
import Token from "../classes/token";
import { verificaToken } from "../middlewares/auth";

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
      const payload = {
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        avatar: userDB.avatar,
      };

      const userToken = Token.getJwtToken(payload);
      return res.status(201).json({
        ok: true,
        mensaje: "Todo funciona bien en post",
        user: userDB,
        token: userToken,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        err
      });
    });
});

// Login
userRoutes.post("/login", (req: Request, res: Response) => {
  const body = req.body;

  try {
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
        const payload = {
          _id: user._id,
          nombre: user.nombre,
          email: user.email,
          avatar: user.avatar,
        };
  
        const userToken = Token.getJwtToken(payload);
  
        return res.status(200).json({
          ok: true,
          token: userToken,
          user: user,
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
  } catch (error) {
    return res.status(400).json({
      message: "Error de credenciales",
    });
  }


});

userRoutes.put("/update", [verificaToken], (req: any, res: Response) => {
  const body = req.body;

  // con findByIdAndUpdate
  // const user = {
  //   nombre: req.body.nombre  ,
  //   email: req.body.email ,
  //   avatar: req.body.avatar ,
  //   // nombre: body.nombre || req.usuario.nombre ,
  //   // email: body.email || req.usuario.email,
  //   // avatar: body.avatar || req.usuario.avatar,
  // };

  Usuario.findById(req.usuario._id, (err, usuarioId) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err,
      });
    }

    if (!usuarioId) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el " + req.usuario._id + "no existe",
        // errors: err
        errors: { message: "No existe un usuario con ese ID" },
      });
    }

    usuarioId.nombre = body.nombre || req.usuario.nombre;
    usuarioId.email = body.email || req.usuario.email;
    usuarioId.avatar = body.avatar || req.usuario.avatar;

    usuarioId.save((err, usuarioGuardadoId) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar usuario",
          errors: err,
        });
      }
      const payload = {
        _id: usuarioGuardadoId._id,
        nombre: usuarioGuardadoId.nombre,
        email: usuarioGuardadoId.email,
        avatar: usuarioGuardadoId.avatar,
      };

      const userToken = Token.getJwtToken(payload);
      usuarioGuardadoId.password = ":)";

      return res.status(200).json({
        ok: true,
        mensaje: "Todo funciona bien en put",
        user: usuarioGuardadoId,
        token: userToken,
      });
    });
  });

  // Usuario.findByIdAndUpdate(id de lo que se quiere actualizar , objeto/data a actualizar, opciones{new:true} para q mongoose regrese la nueva informacion, callbck)
  // Usuario.findByIdAndUpdate(req.usuario._id, user, (err, user) => {
  //   if (err) {
  //     return res.status(500).json({
  //       ok: false,
  //       mensaje: "Error al buscar usuario",
  //       errors: err,
  //     });
  //   }

  //   if (!user) {
  //     return res.status(400).json({
  //       ok: false,
  //       mensaje: "El usuario con el " + req.usuario._id + "no existe",
  //       // errors: err
  //       errors: { message: "No existe un usuario con ese ID" },
  //     });
  //   }

  //   const payload = {
  //     _id: user._id,
  //     nombre: user.nombre,
  //     email: user.email,
  //     avatar: user.avatar,
  //   };

  //   const userToken = Token.getJwtToken(payload);

  //   return res.status(201).json({
  //     ok: true,
  //     mensaje: "Todo funciona bien en post",
  //     user: user,
  //     token: userToken,
  //   });

  // });

  // return res.status(200).json({
  //   ok: true,
  //   user: req.usuario,
  // });
});

userRoutes.get("/", [verificaToken], (req: any, res: Response) => {
  const usuario = req.usuario;
  return res.json({
    ok: true,
    usuario,
  });
});

export default userRoutes;
