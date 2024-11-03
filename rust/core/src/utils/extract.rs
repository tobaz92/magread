use std::fs;
use std::process::Command;

pub fn extract_jpg(folder_pdf: &str, folder_output: &str, nb_page: &usize) -> Vec<String> {
    let folder_output = format!("{}/output", folder_output);

    let mut extract = Command::new("pdftoppm");
    extract
        .arg("-jpeg") // Format JPEG
        .arg("-r")
        .arg("72") // Résolution 72 DPI
        .arg("-f")
        .arg("1") // Première page à extraire
        .arg("-l")
        .arg(nb_page.to_string()) // Dernière page à extraire
        .arg(folder_pdf) // Fichier PDF d'entrée
        .arg("-scale-to")
        .arg("1500") // Forcer la largeur à 1500px, la hauteur s'adaptera automatiquement
        .arg(folder_output.clone()); // Dossier de sortie

    extract.status().expect("process failed to execute");

    let exported_files = path_export_jpg(&folder_output.clone());

    exported_files
}

fn path_export_jpg(folder_output: &str) -> Vec<String> {
    let folder_output_cleaned = folder_output.replace("/output", "");

    // Liste des fichiers, sans .DS_Store
    let files = fs::read_dir(&folder_output_cleaned).unwrap();
    let mut exported_files: Vec<String> = files
        .filter_map(|file| {
            let file = file.ok()?;
            let path = file.path();

            // Filtrer pour ignorer .DS_Store
            if path.file_name()?.to_str()? == ".DS_Store" {
                return None;
            }

            Some(path.to_string_lossy().to_string())
        })
        .collect();

    // Trier les fichiers
    exported_files.sort();

    exported_files
}
