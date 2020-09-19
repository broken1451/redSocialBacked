import { FileUpload } from "../interfaces/file";
// import * as path from 'path';
import path, { resolve } from "path";
import fs from "fs";

import uniqid from "uniqid";

export default class FileSystem {
  constructor() {}

  public guardarImagenTemporal(file: FileUpload, userId: string) {
    return new Promise((resolve, reject) => {
      // crear carpetas
      const path = this.crearCarpetaUser(userId);

      // nombre del archivo
      const nombreArchivo = this.generarNombreArchivo(file);
      // console.log({nombreArchivo});
      // console.log(file.name);

      // mover el archivo
      // archivo.mv(path,(err) =>{
      const Path = `${path}/${nombreArchivo}`;
      file.mv(Path, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private crearCarpetaUser(userId: string) {
    // Creacion del path  __dirname(toda la ruta donde se encuentra en este momento), `referencia a donde se encuentra la imagen`
    const pathhUser = path.resolve(__dirname, `../uploads/${userId}`);
    const pathUserTemp = pathhUser + "/temp"; // imagenes temporal
    // const pathejem = path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
    // const pathhUser1 = path.resolve(__dirname, `../uploads/${userId}/temp`);
    // console.log({ pathhUser, pathUserTemp, pathejem,pathhUser1});

    const existe = fs.existsSync(pathhUser);

    if (!existe) {
      // creando directorios en nodejs
      fs.mkdirSync(pathhUser);
      fs.mkdirSync(pathUserTemp);
    }

    return pathUserTemp;
  }

  //   private generarNombreArchivo(nombreArchivo: string) {
  private generarNombreArchivo(fileNombreArchivo: FileUpload) {
    //   fileNombreArchivo
    const archivo = fileNombreArchivo; //imagen es el nombre que esta en el postman
    const nombreArchivoSeperado = archivo.name.split("."); // separar en un arreglo el archivo para tener su extension
    const extensionArchivo = nombreArchivoSeperado[nombreArchivoSeperado.length - 1]; // obtener la extension del archivo, ultima posicion

    // Nombre unico del archivo
    const idUnico = uniqid();
    return `${idUnico}.${extensionArchivo}`;
  }

  public imagenesTempToPosts(userId: string) {
    const pathTemp = path.resolve(__dirname, `../uploads/${userId}/temp`);
    const pathPosts = path.resolve(__dirname, `../uploads/${userId}/posts`);

    if (!fs.existsSync(pathTemp)) {
      return [];
    }

    if (!fs.existsSync(pathPosts)) {
      fs.mkdirSync(pathPosts);
    }

    const imagenesTemp = this.obtenerImgTemp(userId);

    // mover las imagtemp a posts
    imagenesTemp.forEach((imagen) => {
      console.log({ imagen });
      // fs.renameSync(pathviejo/temporal, nuevoPath)
      fs.renameSync(`${pathTemp}/${imagen}`, `${pathPosts}/${imagen}`);
    });

    return imagenesTemp;
  }

  private obtenerImgTemp(userId: string) {
    const pathTemp = path.resolve(__dirname, `../uploads/${userId}/temp`);

    // leer el directorio
    return fs.readdirSync(pathTemp) || [];
  }

  public getPhotoUrl(userId: string, img: string) {
    //  crear el path post, apuntar a la carpeta post
    const pathPhoto = path.resolve(
      __dirname,
      `../uploads/${userId}/posts/${img}`
    );

    // si la img existe
    const existe = fs.existsSync(pathPhoto);

    if (!existe) {
      const pathNoImage = path.resolve(__dirname,`../assets/400x250.jpg`);
      // fs.mkdirSync(pathNoImage);
      return pathNoImage;
    }

    return pathPhoto;

    // if (fs.existsSync(pathPhoto)) {
    //   return pathPhoto;
    // } else {
    //   const pathNoImage = path.resolve(__dirname, `../assets/400x250.jpg`);
    //   // fs.mkdirSync(pathNoImage);
    //   return pathNoImage;
    // }
  }
}
