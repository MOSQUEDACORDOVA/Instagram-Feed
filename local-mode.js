const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const accessToken = "EAAIpy9we2wUBO6vpc3cpTZBaRA87XoQKBONIttKi5p2MqLnVry1cVzL0jkReceDtFh2UwPB0APmZB3pR6Uun1ELWOaJZCyYG8etdaV1acr0aSZBSgyp1HObQzw7ZA2R4gJ3kl0FmUTZAhDHcveY1ZC7SEfjuJUloZCrpMwSpp5e8C8b4sFUmmsLbZBeWuJgKp2ET7PwZDZD";
const userInstagramId = "17841407570143703"; // Reemplazar con el ID correcto

app.get('/instagram-feed', async (req, res) => {
  try {
    // Obtener los IDs de los posts
    const response = await axios.get(`https://graph.facebook.com/v21.0/${userInstagramId}?fields=media&access_token=${accessToken}`);
    const media = response.data.media.data;

    // Obtener detalles de cada post
    const posts = await Promise.all(
      media.map(async (post) => {
        const postDetails = await axios.get(`https://graph.facebook.com/v21.0/${post.id}?fields=media_url,media_type&access_token=${accessToken}`);
        return postDetails.data;
      })
    );

    // Filtrar solo los posts que sean imágenes
    const imagePosts = posts.filter(post => post.media_type === 'IMAGE');

    // Mapear para devolver solo la propiedad media_url
    const formattedPosts = imagePosts.map(post => ({
      media_url: post.media_url
    }));

    // Devolver las imágenes en el formato deseado
    res.json(formattedPosts);

  } catch (error) {
    console.error('Error al obtener el feed de Instagram:', error);
    res.status(500).json({ error: 'Error al obtener el feed de Instagram' });
  }
});

app.listen(port, () => {
  console.log(`Servidor API escuchando en http://localhost:${port}`);
});
