import json
import sys
from pathlib import Path


VERSION_TOKEN = "__TIKZJAX_VERSION__"
VERSION_TAG_TOKEN = "__TIKZJAX_VERSION_TAG__"

TEXT_FILE_EXTENSIONS = {
    ".html",
    ".js",
    ".css",
    ".json",
    ".xml",
    ".txt",
}


def read_package_version():
    site_dir = Path(__file__).resolve().parent
    package_json_path = site_dir.parent / "package.json"

    try:
        package_data = json.loads(package_json_path.read_text(encoding="utf-8"))
    except Exception as error:
        raise RuntimeError(
            f"Unable to read package.json from {package_json_path}"
        ) from error

    version = str(package_data.get("version", "")).strip()

    if not version:
        raise RuntimeError(
            f"No valid version field found in {package_json_path}"
        )

    return version


def replace_tikzjax_version_tokens(output_dir, version):
    output_path = Path(output_dir).resolve()

    if not output_path.exists():
        raise RuntimeError(f"Output directory does not exist: {output_path}")

    if not output_path.is_dir():
        raise RuntimeError(f"Output path is not a directory: {output_path}")

    replacements = {
        VERSION_TOKEN: version,
        VERSION_TAG_TOKEN: f"v{version}",
    }

    replaced_files = 0
    replaced_occurrences = 0

    for file_path in output_path.rglob("*"):
        if not file_path.is_file():
            continue

        if file_path.suffix.lower() not in TEXT_FILE_EXTENSIONS:
            continue

        text = file_path.read_text(encoding="utf-8")
        updated = text

        for token, value in replacements.items():
            occurrences = updated.count(token)

            if occurrences:
                updated = updated.replace(token, value)
                replaced_occurrences += occurrences

        if updated != text:
            file_path.write_text(updated, encoding="utf-8")
            replaced_files += 1

    return replaced_files, replaced_occurrences


def run_postprocess(output_dir):
    version = read_package_version()

    replaced_files, replaced_occurrences = replace_tikzjax_version_tokens(
        output_dir,
        version
    )

    print(f"TikZJax version: {version}")
    print(f"Site files updated: {replaced_files}")
    print(f"Token occurrences replaced: {replaced_occurrences}")


def on_post_build(config, **kwargs):
    run_postprocess(config["site_dir"])


def on_serve(server, config, builder, **kwargs):
    package_json_path = Path(__file__).resolve().parent.parent / "package.json"

    if package_json_path.exists():
        server.watch(str(package_json_path), builder)

    return server


def main():
    if len(sys.argv) > 1:
        output_dir = sys.argv[1]
    else:
        output_dir = Path(__file__).resolve().parent.parent / "_site"

    run_postprocess(output_dir)


if __name__ == "__main__":
    main()