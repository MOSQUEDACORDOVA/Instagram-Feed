const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors");

const accessToken =functions.config().instagram.accesstoken;
const userInstagramId = "17841407570143703"; // Reemplazar con el ID correcto

// Configuración de CORS para permitir solo tu dominio
const corsOptions = {
  origin: ["https://cdn.mosquedacordova.com", "https://mosquedacordova.com"],
};

exports.getInstagramImages = functions.https.onRequest(async (req, res) => {
  cors(corsOptions)(req, res, async () => {
    try {
      // Obtener los IDs de los posts
      const response = await axios.get(`https://graph.facebook.com/v21.0/${userInstagramId}?fields=media&access_token=${accessToken}`);
      const media = response.data.media.data;

      // Obtener detalles de cada post
      const posts = await Promise.all(
          media.map(async (post) => {
            const postDetails = await axios.get(`https://graph.facebook.com/v21.0/${post.id}?fields=media_url,media_type&access_token=${accessToken}`);
            return postDetails.data;
          }),
      );

      // Filtrar solo los posts que sean imágenes
      const imagePosts = posts.filter((post) => post.media_type === "IMAGE");

      // Mapear para devolver solo la propiedad media_url
      const formattedPosts = imagePosts.map((post) => ({
        media_url: post.media_url,
      }));

      // Devolver las imágenes en el formato deseado
      res.json(formattedPosts);
    } catch (error) {
      console.error("Error al obtener el feed de Instagram:", error);
      res.status(500).json({error: "Error al obtener el feed de Instagram"});
    }
  });
});
