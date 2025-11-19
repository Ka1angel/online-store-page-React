import express from 'express';
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  generateUserId,
  generate2FACode,
  user2FACodes,
} from '../generators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/products_img', express.static(path.join(__dirname, '../assets/products_img')));
app.use('/products_videos', express.static(path.join(__dirname, '../assets/products_videos')));

app.listen(PORT);

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const userId = generateUserId(email);
  const code = generate2FACode();
  user2FACodes[userId] = code;


  res.status(200).json({ success: true, userId, code });
});

app.post('/api/login/twofactor', (req, res) => {
  const { userId, code } = req.body;
  if (user2FACodes[userId] !== code) {
    res.status(400).json({ message: 'Неправильный код' });
  } else {
    delete user2FACodes[userId];
    res.status(200).json({ success: true });
  }
});

app.post('/api/login/twofactor/new', (req, res) => {
  const { userId } = req.body;
  const newCode = generate2FACode();
  user2FACodes[userId] = newCode;
  res.status(200).json({ success: true, code: newCode });
});

const products = [
  { id: 1, image: 'item1.png', price: 4995, oldPrice: 9990, discount: '30%', name: 'Футболка мужская Комары', currency: '₽' },
  { id: 2, image: 'item2.png', price: 2700, oldPrice: 3000, discount: '10%', name: 'Свитшот женский укороченный Yamal est.2017', currency: '₽' },
  { id: 3, image: 'item3.png', price: 1550, name: 'Шапка Yamal комбинация с бумбоном', currency: '₽' },
  { id: 4, image: 'item4.png', price: 640, oldPrice: 800, discount: '20%', name: 'Брелок фирменный «Созвездие»', currency: '₽' },
  { id: 5, image: 'item5.png', price: 3850, name: 'Шорты мужские Yamal', currency: '₽' },
  { id: 6, image: 'item6.png', price: 10000, name: 'Сертификат Yamal', currency: '₽' },
];
const withAssetUrl = product => ({
  ...product,
  image: product.image ? `http://localhost:${PORT}/products_img/${product.image}` : null,
});

app.post('/home/products/search', (req, res) => {
  const { query } = req.body;
  const filtered = !query
    ? products
    : products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  res.json(filtered.map(withAssetUrl));
});
