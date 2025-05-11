import express from 'express';
import cors from 'cors';
import register from "./register"

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Server is running');
});

app.use('/signup', register)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
