import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";
// import { app } from "./server/server";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import Server from "./server/server";
import userRoutes from "./routes/usuario";
import postRouts from "./routes/post";

// console.log('hola servidor ts');
// console.log('Puerto: ', );

const port = Number(process.env.PORT) || 3500;
const url = `mongodb://localhost:27017/RedSocial`;

const server = new Server();

// Body-parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// FileUpload
server.app.use(fileUpload({useTempFiles: true}));

// Cors
server.app.use(cors({ origin: true, credentials: true }));

// Rutas de la app
server.app.use("/user", userRoutes);
server.app.use("/posts", postRouts);

// conect bd de mongo
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    server.start(port, () => {
      console.log(`Servidor corriendo exitosamente en el puerto ${port}`);
    });
    console.log("La conexion a la bd se ha realizado bien");
  })
  .catch((err) => {
    console.log("ENTREEEEEEEEE al catch err: ", err);
    throw err;
  });
