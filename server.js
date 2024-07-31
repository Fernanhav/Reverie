// Importa las dependencias
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Configura la aplicación Express
const app = express();
app.use(express.json());
app.use(cors());

// Conexión a la base de datos MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/tienda_online");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conectado a la base de datos MongoDB");
});

// Define el esquema del modelo para Usuarios
const usuarioSchema = new mongoose.Schema({
  id_usuario: Number,
  nombre: String,
  email: String,
  password: String,
  fecha_reg: { type: Date, default: Date.now },
});

// Define el esquema del modelo para Productos
const productoSchema = new mongoose.Schema({
  id_producto: Number, // Agregar el campo id_producto
  nombre: String,
  descripcion: String,
  precio: Number,
  stock: Number,
  categoria: String,
  foto: String,
  fecha_reg: { type: Date, default: Date.now },
});

// Define el modelo para Productos
const Producto = mongoose.model("Producto", productoSchema, "productos");

// Define el esquema del modelo para el contador de productos
const contadorProductoSchema = new mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 0 }
});

// Define el modelo para el contador de productos
const ContadorProducto = mongoose.model("ContadorProducto", contadorProductoSchema, "contadorProductos");

// Ruta POST para agregar un nuevo producto
app.post("/productos", async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, foto } = req.body;
  try {
    const contador = await ContadorProducto.findByIdAndUpdate(
      "id_producto",
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const nuevoProducto = new Producto({ id_producto: contador.sequence_value, nombre, descripcion, precio, stock, categoria, foto });
    await nuevoProducto.save();
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta GET para obtener todos los productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta PUT para actualizar un producto
app.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, categoria, foto } = req.body;
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { nombre, descripcion, precio, stock, categoria, foto },
      { new: true }
    );
    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta DELETE para eliminar un producto
app.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Producto.findByIdAndDelete(id);
    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Define el modelo para Usuarios
const Usuario = mongoose.model("Usuario", usuarioSchema, "usuarios");

// Define el esquema del modelo para el contador de usuarios
const contadorSchema = new mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 0 }
});

// Define el modelo para el contador de usuarios
const Contador = mongoose.model("Contador", contadorSchema, "contadores");

// Ruta POST para agregar un nuevo usuario
app.post("/registro", async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    // Obtiene el valor actual del contador y lo incrementa en uno
    const contador = await Contador.findByIdAndUpdate(
      "id_usuario",
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    // Crea un nuevo usuario con el valor del contador como id_usuario
    const nuevoUsuario = new Usuario({ id_usuario: contador.sequence_value, nombre, email, password });
    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta de inicio de sesión (Login)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });

    // Verifica si el usuario existe y la contraseña coincide
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Devuelve el ID del usuario si la autenticación es exitosa
    res.status(200).json({ id_usuario: user.id_usuario });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Nueva ruta para obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Nueva ruta para actualizar un usuario
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { nombre, email, password },
      { new: true }
    );
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Nueva ruta para eliminar un usuario
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Usuario.findByIdAndDelete(id);
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Define el esquema del modelo para Reseñas
const resenaSchema = new mongoose.Schema({
  id_resena: Number,
  id_producto: Number,
  id_usuario: Number,
  calificacion: Number,
  comentario: String,
  fecha: { type: Date, default: Date.now },
});

// Define el modelo para Reseñas
const Resena = mongoose.model("Resena", resenaSchema, "resenas");

// Define el esquema del modelo para el contador de reseñas
const contadorResenaSchema = new mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 0 }
});

// Define el modelo para el contador de reseñas
const ContadorResena = mongoose.model("ContadorResena", contadorResenaSchema, "contadorResenas");

// Ruta POST para agregar una nueva reseña
app.post("/resenas", async (req, res) => {
  const { id_producto, id_usuario, calificacion, comentario, fecha } = req.body;
  
  // Validar si se debe insertar la reseña
  if (!calificacion || !comentario) {
    res.status(400).json({ message: "Calificación y comentario son campos requeridos para la reseña." });
    return;
  }

  try {
    const contador = await ContadorResena.findByIdAndUpdate(
      "id_resena",
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const nuevaResena = new Resena({
      id_resena: contador.sequence_value,
      id_producto,
      id_usuario,
      calificacion,
      comentario,
      fecha: fecha ? new Date(fecha) : Date.now()
    });
    await nuevaResena.save();
    res.status(201).json({ message: "Reseña agregada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta GET para obtener todas las reseñas
app.get("/resenas", async (req, res) => {
  try {
    const resenas = await Resena.find();
    res.status(200).json(resenas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta PUT para actualizar una reseña
app.put("/resenas/:id", async (req, res) => {
  const { id } = req.params;
  const { id_producto, id_usuario, calificacion, comentario, fecha } = req.body;
  try {
    const resenaActualizada = await Resena.findByIdAndUpdate(
      id,
      { id_producto, id_usuario, calificacion, comentario, fecha },
      { new: true }
    );
    res.status(200).json(resenaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta DELETE para eliminar una reseña
app.delete("/resenas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Resena.findByIdAndDelete(id);
    res.status(200).json({ message: "Reseña eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Define el esquema del modelo para Recibos
const reciboSchema = new mongoose.Schema({
  id_recibo: Number,
  id_compra: Number,
  id_usuario: Number,
  fecha_emi: { type: Date, default: Date.now },
  detalle: String,
  precio_total: Number, // Nuevo campo para el precio total
});

// Define el modelo para Recibos
const Recibo = mongoose.model("Recibo", reciboSchema, "recibos");

// Define el esquema del modelo para el contador de recibos
const contadorReciboSchema = new mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 0 }
});

// Define el modelo para el contador de recibos
const ContadorRecibo = mongoose.model("ContadorRecibo", contadorReciboSchema, "contadorRecibos");

//RUTA GET OBTENER TODOS LOS RECIBOS

app.get("/recibos", async (req, res) => {
  try {
    const recibos = await Recibo.find();
    const recibosConDetalles = await Promise.all(recibos.map(async (recibo) => {
      const usuario = await Usuario.findOne({ id_usuario: recibo.id_usuario });
      return {
        ...recibo.toObject(),
        nombre_usuario: usuario ? usuario.nombre : "Usuario no encontrado"
      };
    }));
    res.status(200).json(recibosConDetalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

//RUTA GET DE OBTENER un recibo por ID

app.get("/recibos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recibo = await Recibo.findOne({ id_recibo: id });
    if (recibo) {
      res.status(200).json(recibo);
    } else {
      res.status(404).json({ message: "Recibo no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

//RUTA POST RECIBO

app.post("/recibos", async (req, res) => {
  const { id_usuario, productos } = req.body;

  try {
    const contador = await ContadorRecibo.findByIdAndUpdate(
      "id_recibo",
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const productosDisponibles = await Producto.find(); // Obtener productos disponibles

    // Calcular el detalle y el precio total de la compra
    const detalle = productos.map((producto) => {
      const nombreProducto =
        productosDisponibles.find((p) => p.id_producto === producto.id_producto)
          ?.nombre || "Producto no encontrado";
      return `${producto.cantidad} ${nombreProducto}`;
    }).join(", ");

    let precioTotal = 0;
    for (const producto of productos) {
      const { id_producto, cantidad } = producto;
      const productoInfo = productosDisponibles.find((p) => p.id_producto === id_producto);
      if (productoInfo) {
        precioTotal += productoInfo.precio * cantidad;
      }
    }

    const nuevoRecibo = new Recibo({
      id_recibo: contador.sequence_value,
      id_compra: contador.sequence_value,
      id_usuario,
      fecha_emi: new Date(),
      detalle,
      precio_total: precioTotal,
    });

    await nuevoRecibo.save();
    res.status(201).json({ message: "Recibo agregado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

//RUTA ELIMINAR RECIBO

app.delete("/recibos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Recibo.findOneAndDelete({ id_recibo: id });
    res.status(200).json({ message: "Recibo eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});



// Esquema del catálogo
const catalogoSchema = new mongoose.Schema({
  id_catalogo: Number,
  nombre: String,
  descripcion: String,
  fecha_act: { type: Date, default: Date.now },
  productos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }],
});

// Middleware para actualizar la fecha antes de guardar
catalogoSchema.pre('save', function(next) {
  this.fecha_act = Date.now();
  next();
});

// Middleware para actualizar la fecha antes de actualizar
catalogoSchema.pre('findOneAndUpdate', function(next) {
  this._update.fecha_act = Date.now();
  next();
});

const Catalogo = mongoose.model('Catalogo', catalogoSchema, 'catalogo');

// Esquema del contador de catálogo
const contadorCatalogoSchema = new mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 0 }
});

const ContadorCatalogo = mongoose.model('ContadorCatalogo', contadorCatalogoSchema, 'contadores_catalogo');

// Ruta para crear un nuevo catálogo
app.post('/catalogo', async (req, res) => {
  const { nombre, descripcion, productos } = req.body;
  try {
    const contador = await ContadorCatalogo.findByIdAndUpdate(
      'id_catalogo',
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const nuevoCatalogo = new Catalogo({
      id_catalogo: contador.sequence_value,
      nombre,
      descripcion,
      productos
    });
    await nuevoCatalogo.save();
    res.status(201).json(nuevoCatalogo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para obtener todos los catálogos
app.get('/catalogo', async (req, res) => {
  try {
    const catalogos = await Catalogo.find().populate('productos', 'nombre');
    res.status(200).json(catalogos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para actualizar un catálogo
app.put('/catalogo/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, productos } = req.body;
  try {
    const catalogoActualizado = await Catalogo.findByIdAndUpdate(
      id,
      { nombre, descripcion, productos },
      { new: true }
    ).populate('productos', 'nombre');
    res.status(200).json(catalogoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para eliminar un catálogo
app.delete('/catalogo/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Catalogo.findByIdAndDelete(id);
    res.status(200).json({ message: 'Catálogo eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Define el esquema del modelo para Carritos
const carritoSchema = new mongoose.Schema({
  id_usuario: Number,
  productos: [
    {
      id_producto: Number,
      cantidad: Number,
      nombre: String,
      precio: Number,
      foto: String,
    },
  ],
});

// Define el modelo para Carritos
const Carrito = mongoose.model("Carrito", carritoSchema, "carritos");

// Ruta GET para obtener el carrito de un usuario
app.get("/carrito/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    let carrito = await Carrito.findOne({ id_usuario });
    if (!carrito) {
      carrito = new Carrito({ id_usuario, productos: [] });
      await carrito.save();
    }
    res.status(200).json(carrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta POST para agregar un producto al carrito de un usuario
app.post("/carrito/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  const { id_producto, cantidad } = req.body;

  try {
    // Verificar si el producto existe en la colección de productos
    const producto = await Producto.findOne({ id_producto });
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Buscar el carrito del usuario
    const carrito = await Carrito.findOne({ id_usuario });
    if (carrito) {
      // Si el carrito existe, actualizar o agregar el producto
      const productoIndex = carrito.productos.findIndex(
        (p) => p.id_producto === id_producto
      );

      if (productoIndex !== -1) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        carrito.productos[productoIndex].cantidad += cantidad;
      } else {
        // Si el producto no está en el carrito, agregarlo
        carrito.productos.push({
          id_producto,
          cantidad,
          nombre: producto.nombre,
          precio: producto.precio,
          foto: producto.foto,
        });
      }

      // Guardar el carrito actualizado
      await carrito.save();
      res.status(200).json(carrito);
    } else {
      // Si el carrito no existe, crear uno nuevo
      const nuevoCarrito = new Carrito({
        id_usuario,
        productos: [
          {
            id_producto,
            cantidad,
            nombre: producto.nombre,
            precio: producto.precio,
            foto: producto.foto,
          },
        ],
      });

      // Guardar el nuevo carrito
      await nuevoCarrito.save();
      res.status(201).json(nuevoCarrito);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});


// Ruta DELETE para eliminar un producto del carrito de un usuario
app.delete("/carrito/:id_usuario/:id_producto", async (req, res) => {
  const { id_usuario, id_producto } = req.params;
  console.log("Eliminar producto con ID:", id_producto, "del usuario con ID:", id_usuario);
  try {
    const carrito = await Carrito.findOne({ id_usuario });
    if (carrito) {
      const productoIndex = carrito.productos.findIndex(
        (p) => p.id_producto === parseInt(id_producto, 10)
      );
      if (productoIndex !== -1) {
        console.log("Producto encontrado. Eliminando...");
        carrito.productos.splice(productoIndex, 1);
        await carrito.save();
        res.status(200).json(carrito);
      } else {
        console.log("Producto no encontrado en el carrito");
        res.status(404).json({ message: "Producto no encontrado en el carrito" });
      }
    } else {
      console.log("Carrito no encontrado para el usuario con ID:", id_usuario);
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta PUT para vaciar el carrito de un usuario
app.put("/carrito/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const carrito = await Carrito.findOne({ id_usuario });
    if (carrito) {
      carrito.productos = []; // Vaciar los productos del carrito
      await carrito.save();
      res.status(200).json({ message: "Carrito vaciado" });
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});


// Ruta PUT para actualizar la cantidad de un producto en el carrito de un usuario
app.put("/carrito/:id_usuario/:id_producto", async (req, res) => {
  const { id_usuario, id_producto } = req.params;
  const { cantidad } = req.body;
  try {
    const carrito = await Carrito.findOne({ id_usuario });
    if (carrito) {
      const productoIndex = carrito.productos.findIndex(
        (p) => p.id_producto == id_producto // Asegúrate de usar comparación no estricta o convierte a número
      );
      if (productoIndex !== -1) {
        carrito.productos[productoIndex].cantidad = cantidad;
        await carrito.save();
        res.status(200).json(carrito);
      } else {
        res.status(404).json({ message: "Producto no encontrado en el carrito" });
      }
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});