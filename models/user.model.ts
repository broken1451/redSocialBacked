import mongoose from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({ 
  nombre: { type: String, required: [true, "El nombre es necesario y unico"] },
  avatar: { type: String, default: "av-1.png" },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario y unico"],
  },
  password: { type: String, required: [true, "La clave esnecesaria"] },
});

 userSchema.method<User | any>("compararClave", function (password: string = ""): boolean {
  if (bcrypt.compareSync(password, this.password)) {
    return true;
  } else {
    return false;
  }
});

interface User extends mongoose.Document {
  nombre: string;
  avatar?: string;
  email: string;
  password: string;   
  compararClave(password: string): boolean;
}

// usuarioSchema.plugin(uniqueValidator, {message:'{PATH} debe ser unico'})
userSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico'} )

export const Usuario = mongoose.model<User>("Usuario", userSchema);
