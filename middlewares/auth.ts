import { NextFunction, Request, Response } from "express";
import Token from "../classes/token";

export const verificaToken = (req: any, res: Response, next: NextFunction) => {
  // token enviado por los headers
  const userToken = req.get("x-token") || "";

  Token.comprobarToken(userToken)
    .then((decoded: any) => {
      console.log({ decoded });
      req.usuario = decoded.usuario;
      //  let  usuario = req.usuario;
      //  usuario =  decoded.usuario
      //  console.log({usuario});
      //  console.log({req: req.usuario});
      //  const usuario =
      next();
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        mensaje: "token no valido",
      });
    });
};
