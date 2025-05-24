import os
import shutil
import subprocess
import json
from pathlib import Path
from PIL import Image
import pillow_avif

def listar_archivos_recursivos(carpeta: Path, extensiones=None):
    """
    Retorna todos los archivos en la carpeta y subcarpetas.
    Si extensiones es None, lista todos.
    Si extensiones es una lista, solo archivos con esas extensiones.
    """
    archivos = []
    for path in carpeta.rglob("*"):
        if path.is_file():
            if extensiones is None or path.suffix.lower() in extensiones:
                archivos.append(path)
    return archivos


SOURCE = Path("recursos")
DEST = Path("public")

SOURCE_DIRS = {
    "imagenes": SOURCE / "imagenes",
    "videos": SOURCE / "videos",
    "audios": SOURCE / "audios",
    "svg": SOURCE / "svg",
    "og": SOURCE / "og",
    "favicon": SOURCE / "favicon"
}

DEST_DIRS = {
    "imagenes": DEST / "imagenes",
    "videos": DEST / "videos",
    "audios": DEST / "audios",
    "svg": DEST / "svg",
    "og": DEST / "og",
    "favicon": DEST / "favicon",
    "gif": DEST / "gif",
    "registros": DEST / "registros"
}

for path in DEST_DIRS.values():
    path.mkdir(parents=True, exist_ok=True)

def get_registro(tipo):
    path = DEST_DIRS["registros"] / f"{tipo}.json"
    return json.load(open(path, encoding="utf-8")) if path.exists() else {}

def guardar_registro(tipo, data):
    path = DEST_DIRS["registros"] / f"{tipo}.json"
    json.dump(data, open(path, "w", encoding="utf-8"), indent=2)

def eliminar_archivos(lista, carpeta):
    for nombre in lista:
        ruta = carpeta / nombre
        if ruta.exists():
            print(f"Eliminando archivo huérfano: {ruta}")
            ruta.unlink()

def optimizar_y_convertir_img(path_img, destino_base):
    print(f"Procesando imagen: {path_img}")
    img = Image.open(path_img)
    base = path_img.stem
    has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
    calidad = 80
    ext = ".png" if has_alpha else ".jpg"
    # Creamos carpeta destino si no existe
    destino_base.mkdir(parents=True, exist_ok=True)
    salida = destino_base / f"{base}{ext}"
    img = img.convert("RGBA" if has_alpha else "RGB")

    while True:
        img.save(salida, format="PNG" if has_alpha else "JPEG", optimize=True, quality=calidad)
        size_mb = salida.stat().st_size / (1024 * 1024)
        if size_mb <= 1 or calidad <= 50:
            break
        calidad -= 5

    webp = destino_base / f"{base}.webp"
    avif = destino_base / f"{base}.avif"
    img.save(webp, format="WEBP", quality=80)
    img.save(avif, format="AVIF", quality=50)

    return [str(salida.relative_to(DEST)), str(webp.relative_to(DEST)), str(avif.relative_to(DEST))]

def procesar_imagenes():
    print("\nProcesando carpeta: imagenes")
    registro = get_registro("imagenes")
    # Listar todos los archivos recursivamente con extensiones comunes de imágenes
    extensiones = [".png", ".jpg", ".jpeg", ".webp", ".avif"]
    archivos = listar_archivos_recursivos(SOURCE_DIRS["imagenes"], extensiones)

    actuales = {str(f.relative_to(SOURCE_DIRS["imagenes"])) for f in archivos}
    nuevos = {}

    # Eliminar archivos huérfanos en public
    for entrada, salidas in registro.items():
        if entrada not in actuales:
            for archivo in salidas:
                ruta = DEST / archivo
                if ruta.exists():
                    print(f"Eliminando archivo huérfano: {ruta}")
                    ruta.unlink()

    # Procesar cada imagen
    for img in archivos:
        rel_path = img.relative_to(SOURCE_DIRS["imagenes"])
        salida_base = DEST_DIRS["imagenes"] / rel_path.parent
        salidas = registro.get(str(rel_path))
        # Comprobar si ya existen los archivos procesados
        if salidas and all((DEST / Path(s)).exists() for s in salidas):
            print(f"Omitido (ya procesado): {rel_path}")
            nuevos[str(rel_path)] = salidas
        else:
            nuevos[str(rel_path)] = optimizar_y_convertir_img(img, salida_base)

    guardar_registro("imagenes", nuevos)

def convertir_video(path_vid, destino_base):
    print(f"Procesando video: {path_vid}")
    base = path_vid.stem
    destino_base.mkdir(parents=True, exist_ok=True)
    mp4 = destino_base / f"{base}.mp4"
    webm = destino_base / f"{base}.webm"
    ogg = destino_base / f"{base}.ogg"
    gif_path = DEST_DIRS["gif"]
    gif_path.mkdir(parents=True, exist_ok=True)
    gif = gif_path / f"{base}.gif"

    subprocess.run(["ffmpeg", "-i", str(path_vid), "-vf", "scale=1280:-1", "-crf", "24", "-r", "30", "-c:v", "libx264", "-y", str(mp4)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-i", str(mp4), "-c:v", "libvpx-vp9", "-b:v", "200k", "-crf", "35", "-y", str(webm)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-i", str(mp4), "-c:v", "libtheora", "-qscale:v", "5", "-y", str(ogg)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-y", "-i", str(path_vid), "-vf", "fps=10,scale=480:-1:flags=lanczos", "-t", "3", str(gif)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    formatos = [str(mp4.relative_to(DEST)), str(webm.relative_to(DEST)), str(ogg.relative_to(DEST))]
    gif_rel = str(gif.relative_to(DEST))

    return formatos, gif_rel

def procesar_videos():
    print("\nProcesando carpeta: videos")
    registro = get_registro("videos")
    extensiones = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".ogg"]
    archivos = listar_archivos_recursivos(SOURCE_DIRS["videos"], extensiones)

    actuales = {str(f.relative_to(SOURCE_DIRS["videos"])) for f in archivos}
    nuevos = {}

    # Eliminar archivos huérfanos
    for entrada, datos in registro.items():
        if entrada not in actuales:
            if isinstance(datos, dict):
                eliminar_archivos(datos.get("formatos", []), DEST)
                eliminar_archivos([datos.get("gif", "")], DEST)

    for vid in archivos:
        rel_path = vid.relative_to(SOURCE_DIRS["videos"])
        destino_base = DEST_DIRS["videos"] / rel_path.parent
        actual = registro.get(str(rel_path), {})
        formatos_ok = all((DEST / Path(f)).exists() for f in actual.get("formatos", []))
        gif_ok = (DEST / Path(actual.get("gif", ""))).exists()

        if actual and formatos_ok and gif_ok:
            print(f"Omitido (ya procesado): {rel_path}")
            nuevos[str(rel_path)] = actual
            continue

        formatos, gif = convertir_video(vid, destino_base)
        nuevos[str(rel_path)] = {"formatos": formatos, "gif": gif}

    guardar_registro("videos", nuevos)

def mover_audios():
    print("\nProcesando carpeta: audios")
    registro = get_registro("audios")
    extensiones = None  # puedes agregar extensiones si quieres
    archivos = listar_archivos_recursivos(SOURCE_DIRS["audios"], extensiones)

    actuales = {str(f.relative_to(SOURCE_DIRS["audios"])) for f in archivos}
    nuevos = {}

    for entrada, salidas in registro.items():
        if entrada not in actuales:
            eliminar_archivos(salidas, DEST)

    for aud in archivos:
        rel_path = aud.relative_to(SOURCE_DIRS["audios"])
        destino = DEST_DIRS["audios"] / rel_path
        destino.parent.mkdir(parents=True, exist_ok=True)
        if not destino.exists():
            print(f"Copiando audio: {rel_path}")
            shutil.copy2(aud, destino)
        else:
            print(f"Omitido (ya presente): {rel_path}")
        nuevos[str(rel_path)] = [str(rel_path)]

    guardar_registro("audios", nuevos)

def copiar_svgs():
    print("\nProcesando carpeta: svg")
    registro = get_registro("svg")
    extensiones = [".svg"]
    archivos = listar_archivos_recursivos(SOURCE_DIRS["svg"], extensiones)

    actuales = {str(f.relative_to(SOURCE_DIRS["svg"])) for f in archivos}
    nuevos = {}

    for entrada, salidas in registro.items():
        if entrada not in actuales:
            eliminar_archivos(salidas, DEST)

    for svg in archivos:
        rel_path = svg.relative_to(SOURCE_DIRS["svg"])
        destino = DEST_DIRS["svg"] / rel_path
        destino.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(svg, destino)
        print(f"Copiado: {rel_path}")
        nuevos[str(rel_path)] = [str(rel_path)]

    guardar_registro("svg", nuevos)

def procesar_og():
    print("\nProcesando carpeta: og")
    registro = get_registro("og")
    archivos = listar_archivos_recursivos(SOURCE_DIRS["og"])

    nuevos = {}

    if archivos:
        img = Image.open(archivos[0]).convert("RGB")
        salida = archivos[0].stem + ".jpg"
        DEST_DIRS["og"].mkdir(parents=True, exist_ok=True)
        img.save(DEST_DIRS["og"] / salida, format="JPEG", quality=85)
        print(f"Generado OG: {salida}")
        nuevos[archivos[0].name] = [salida]

    for entrada, salidas in registro.items():
        if entrada not in {a.name for a in archivos}:
            eliminar_archivos(salidas, DEST_DIRS["og"])

    guardar_registro("og", nuevos)

def generar_favicons():
    print("\nProcesando carpeta: favicon")
    registro = get_registro("favicon")
    nuevos = {}
    archivos = list(SOURCE_DIRS["favicon"].glob("*"))

    if not archivos:
        return

    base = archivos[0]
    img = Image.open(base)
    tamaños = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512
    }

    salidas = []
    for nombre, size in tamaños.items():
        img.resize((size, size)).save(DEST_DIRS["favicon"] / nombre, format="PNG")
        salidas.append(nombre)

    img.resize((32, 32)).save(DEST_DIRS["favicon"] / "favicon.ico", format="ICO")
    salidas.append("favicon.ico")

    manifest = {
        "icons": [
            {"src": "/favicon/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/favicon/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"}
        ]
    }
    with open(DEST_DIRS["favicon"] / "site.webmanifest", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    salidas.append("site.webmanifest")

    print("Favicons generados.")
    nuevos[base.name] = salidas

    for entrada, salidas in registro.items():
        if entrada not in {a.name for a in archivos}:
            eliminar_archivos(salidas, DEST_DIRS["favicon"])

    guardar_registro("favicon", nuevos)

def procesar_todo():
    print("\nIniciando procesamiento multimedia...\n")
    procesar_imagenes()
    procesar_videos()
    mover_audios()
    copiar_svgs()
    procesar_og()
    generar_favicons()
    print("\nProcesamiento finalizado.\n")

if __name__ == "__main__":
    procesar_todo()


# pip install Pillow pillow-avif-plugin
