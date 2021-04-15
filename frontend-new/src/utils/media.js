const LZUTF8 = require('lzutf8');

export function readMedia(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
}

export function compress(data, outputEncoding = 'StorageBinaryString') {
  return new Promise((resolve, reject) => {
    LZUTF8.compressAsync(data, { outputEncoding }, (result, error) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

export function decompress(data, inputEncoding = 'StorageBinaryString') {
  return new Promise((resolve, reject) => {
    LZUTF8.decompressAsync(data, { inputEncoding }, (result, error) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}
// StorageBinaryString
