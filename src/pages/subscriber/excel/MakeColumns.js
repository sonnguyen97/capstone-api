import XLSX from 'xlsx'
/* generate an array of column objects */
export const makeCols = refstr => {
  const o = []
  const C = XLSX.utils.decode_range(refstr).e.c + 1
  // eslint-disable-next-line
  for (let i = 0; i < C; i += 1) o[i] = { name: XLSX.utils.encode_col(i), key: i }
  return o
}

export default makeCols
