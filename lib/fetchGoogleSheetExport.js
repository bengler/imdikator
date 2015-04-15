export default function fetchGoogleSheetExport(key, gid, opts = {format: 'csv'}) {
  return request.get(`https://docs.google.com/spreadsheets/d/${key}/export`, {format: format || 'csv', gid});
}
