import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

const postSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  mensaje: { type: String },
  imgs: [
    {
      type: String,
    },
  ],
  coors: { type: String }, // latitud y longitud
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: [
      true,
      "Debe de existir una referencia al usuario, campo obligatorio",
    ],
  }, // relacion con usuarios
});

// setear fecha de creacion cuando se haga una insercion en la base de datos
postSchema.pre<Post>("save", function (next) {
  this.created = new Date();
  next();
});

interface Post extends mongoose.Document {
  created: Date;
  mensaje?: string;
  img: string[];
  coors: string;
}

export const Post = mongoose.model<Post>("Post", postSchema);
