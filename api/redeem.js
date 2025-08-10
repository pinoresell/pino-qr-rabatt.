import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, code } = req.body;

  if (!username || !code) {
    return res.status(400).json({ message: 'Missing username or code' });
  }

  const filePath = path.join(process.cwd(), 'codes.json');
  let codes = {};

  // Codes aus Datei laden
  if (fs.existsSync(filePath)) {
    codes = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  // Prüfen, ob Code schon benutzt wurde
  if (codes[code]) {
    return res.status(400).json({ message: 'Code already used' });
  }

  // Code speichern
  codes[code] = username;
  fs.writeFileSync(filePath, JSON.stringify(codes, null, 2));

  res.status(200).json({ message: 'Code redeemed successfully' });
}
