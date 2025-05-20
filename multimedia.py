import os
import shutil
import subprocess
import json
from pathlib import Path
from PIL import Image
import pillow_avif

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

def optimizar_y_convertir_img(path_img):
    print(f"Procesando imagen: {path_img.name}")
    img = Image.open(path_img)
    base = path_img.stem
    has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
    calidad = 80
    ext = ".png" if has_alpha else ".jpg"
    salida = DEST_DIRS["imagenes"] / f"{base}{ext}"
    img = img.convert("RGBA" if has_alpha else "RGB")

    while True:
        img.save(salida, format="PNG" if has_alpha else "JPEG", optimize=True, quality=calidad)
        size_mb = salida.stat().st_size / (1024 * 1024)
        if size_mb <= 1 or calidad <= 50:
            break
        calidad -= 5

    webp = DEST_DIRS["imagenes"] / f"{base}.webp"
    avif = DEST_DIRS["imagenes"] / f"{base}.avif"
    img.save(webp, format="WEBP", quality=80)
    img.save(avif, format="AVIF", quality=50)

    return [salida.name, webp.name, avif.name]

def procesar_imagenes():
    print("\nProcesando carpeta: imagenes")
    registro = get_registro("imagenes")
    actuales = {img.name for img in SOURCE_DIRS["imagenes"].glob("*")}
    nuevos = {}

    for entrada, salidas in registro.items():
        if entrada not in actuales:
            eliminar_archivos(salidas, DEST_DIRS["imagenes"])

    for img in SOURCE_DIRS["imagenes"].glob("*"):
        salidas = registro.get(img.name)
        if salidas and all((DEST_DIRS["imagenes"] / s).exists() for s in salidas):
            print(f"Omitido (ya procesado): {img.name}")
            nuevos[img.name] = salidas
        else:
            nuevos[img.name] = optimizar_y_convertir_img(img)

    guardar_registro("imagenes", nuevos)

    guardar_registro("imagenes", nuevos)

def convertir_video(path_vid):
    print(f"Procesando video: {path_vid.name}")
    base = path_vid.stem
    mp4 = f"{base}.mp4"
    webm = f"{base}.webm"
    ogg = f"{base}.ogg"
    gif = f"{base}.gif"

    subprocess.run(["ffmpeg", "-i", str(path_vid), "-vf", "scale=1280:-1", "-crf", "24", "-r", "30", "-c:v", "libx264", "-y", str(DEST_DIRS["videos"] / mp4)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-i", str(DEST_DIRS["videos"] / mp4), "-c:v", "libvpx-vp9", "-b:v", "200k", "-crf", "35", "-y", str(DEST_DIRS["videos"] / webm)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-i", str(DEST_DIRS["videos"] / mp4), "-c:v", "libtheora", "-qscale:v", "5", "-y", str(DEST_DIRS["videos"] / ogg)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-y", "-i", str(path_vid), "-vf", "fps=10,scale=480:-1:flags=lanczos", "-t", "3", str(DEST_DIRS["gif"] / gif)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    return [mp4, webm, ogg], gif

def procesar_videos():
    print("\nProcesando carpeta: videos")
    registro = get_registro("videos")
    actuales = {v.name for v in SOURCE_DIRS["videos"].glob("*")}
    nuevos = {}

    for entrada, datos in registro.items():
        if entrada not in actuales:
            if isinstance(datos, dict):
                eliminar_archivos(datos.get("formatos", []), DEST_DIRS["videos"])
                eliminar_archivos([datos.get("gif", "")], DEST_DIRS["gif"])

    for vid in SOURCE_DIRS["videos"].glob("*"):
        actual = registro.get(vid.name, {})
        formatos_ok = all((DEST_DIRS["videos"] / f).exists() for f in actual.get("formatos", []))
        gif_ok = (DEST_DIRS["gif"] / actual.get("gif", "")).exists()

        if actual and formatos_ok and gif_ok:
            print(f"Omitido (ya procesado): {vid.name}")
            nuevos[vid.name] = actual
            continue

        formatos, gif = convertir_video(vid)
        nuevos[vid.name] = {"formatos": formatos, "gif": gif}

    guardar_registro("videos", nuevos)

def mover_audios():
    print("\nProcesando carpeta: audios")
    registro = get_registro("audios")
    actuales = {a.name for a in SOURCE_DIRS["audios"].glob("*")}
    nuevos = {}

    for entrada, salidas in registro.items():
        if entrada not in actuales:
            eliminar_archivos(salidas, DEST_DIRS["audios"])

    for aud in SOURCE_DIRS["audios"].glob("*"):
        destino = DEST_DIRS["audios"] / aud.name
        if not destino.exists():
            print(f"Copiando audio: {aud.name}")
            shutil.copy2(aud, destino)
        else:
            print(f"Omitido (ya presente): {aud.name}")
        nuevos[aud.name] = [aud.name]

    guardar_registro("audios", nuevos)

def copiar_svgs():
    print("\nProcesando carpeta: svg")
    registro = get_registro("svg")
    actuales = {s.name for s in SOURCE_DIRS["svg"].glob("*.svg")}
    nuevos = {}

    for entrada, salidas in registro.items():
        if entrada not in actuales:
            eliminar_archivos(salidas, DEST_DIRS["svg"])

    for svg in SOURCE_DIRS["svg"].glob("*.svg"):
        shutil.copy2(svg, DEST_DIRS["svg"] / svg.name)
        print(f"Copiado: {svg.name}")
        nuevos[svg.name] = [svg.name]

    guardar_registro("svg", nuevos)

def procesar_og():
    print("\nProcesando carpeta: og")
    registro = get_registro("og")
    nuevos = {}
    archivos = list(SOURCE_DIRS["og"].glob("*"))

    if archivos:
        img = Image.open(archivos[0]).convert("RGB")
        salida = f"{archivos[0].stem}.jpg"
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
