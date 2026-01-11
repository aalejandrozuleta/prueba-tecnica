/**
 * Fuerza la descarga de un archivo en el navegador.
 *
 * @param blob Archivo recibido del backend
 * @param filename Nombre del archivo
 */
export function downloadFile(
  blob: Blob,
  filename: string,
): void {
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
