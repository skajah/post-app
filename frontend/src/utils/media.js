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
  return LZUTF8.compress(data, { outputEncoding });
}

export function decompress(data, inputEncoding = 'StorageBinaryString') {
  return LZUTF8.decompress(data, { inputEncoding });
}
// StorageBinaryString
