import LZString from 'lz-string'


export const compress = (string) => LZString.compressToUint8Array(string)
export const decompress = (string) => LZString.decompressFromUint8Array(string)

export const encode = (buffer) => btoa(Array.prototype.map.call(buffer, (ch) => String.fromCharCode(ch)).join(''))

export const decode = (base64) => {
  const binstr = atob(base64)
  const buffer = new Uint8Array(binstr.length)
  Array.prototype.forEach.call(binstr, (ch, index) => buffer[index] = ch.charCodeAt(0))
  return buffer
}

export const editorSerialize = (array) => {
  const stringified = JSON.stringify(array)
  const compressed = compress(stringified)
  const encoded = encode(compressed)
  return encoded
}

export const editorDeserialize = (encodedString) => {
  const decoded = decode(encodedString)
  const deCompressed = decompress(decoded)
  const deStringify = deCompressed
  .split("|").
  map(decompressedRepresentation => JSON.parse(decompressedRepresentation))

  return deStringify
}