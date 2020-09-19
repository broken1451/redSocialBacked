import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({ 
  nombre: { type: String, required: [true, "El nombre es necesario"] },
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


export const Usuario = mongoose.model<User>("Usuario", userSchema);
