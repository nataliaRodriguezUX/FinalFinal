/*import mongoose from 'mongoose' ; 
export async function connectDB(){
    try {
        await mongoose.connect('mongodb+srv://Grupo-08:grupo08@cursadanodejs.ls9ii.mongodb.net/Node-js');
        console.log('Conexión exitosa a MongoDB' ); 
    }catch (error) {
        console.error ('Error al conectar a MongoDB:' , error ); 
        process.exit (1);
}
}
*/

import mongoose from 'mongoose';


export async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://Grupo-08:grupo08@cursadanodejs.ls9ii.mongodb.net/Node-js');
        console.log('Conexión exitosa a MongoDB');
    } catch  (error) {
        console.log('Error al conectar a MongoDB', error);
        process.exit(1)
    }
}