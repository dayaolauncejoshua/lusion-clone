import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/projects', (req, res) => {
  res.json({
    projects: [
      {
        id: 1,
        title: 'Project Alpha',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        model: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
      },
      {
        id: 2,
        title: 'Project Beta',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        model: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
      },
    ],
  });
});

app.listen(PORT, () => console.log(`Server on :${PORT}`));