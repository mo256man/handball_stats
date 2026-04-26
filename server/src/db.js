import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'handball.sqlite');
export const db = new sqlite3.Database(dbPath);

// テーブルの初期化
db.all("PRAGMA table_info(match)", (err, columns) => {
  if (!err && columns) {
    const hasGks0 = columns.some(col => col.name === 'gks0');
    const hasGks1 = columns.some(col => col.name === 'gks1');
    
    if (!hasGks0) {
      db.run("ALTER TABLE match ADD COLUMN gks0 TEXT", (err) => {
        if (err && err.message.includes('duplicate column')) {
          console.log('gks0 カラムは既に存在します');
        } else if (err) {
          console.error('gks0 カラムの追加に失敗:', err.message);
        } else {
          console.log('gks0 カラムを追加しました');
        }
      });
    }
    
    if (!hasGks1) {
      db.run("ALTER TABLE match ADD COLUMN gks1 TEXT", (err) => {
        if (err && err.message.includes('duplicate column')) {
          console.log('gks1 カラムは既に存在します');
        } else if (err) {
          console.error('gks1 カラムの追加に失敗:', err.message);
        } else {
          console.log('gks1 カラムを追加しました');
        }
      });
    }
  }
});
