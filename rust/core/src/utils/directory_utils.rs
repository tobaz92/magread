use std::fs;
use std::io;
use std::path::Path;

/// Réinitialise le dossier de données en le supprimant puis en le recréant.
pub fn reset_folder(path: &str) -> io::Result<()> {
    let data_path = Path::new(path);

    // Supprimer le dossier s'il existe
    if data_path.exists() {
        fs::remove_dir_all(data_path)?;
    }

    // Créer le dossier
    fs::create_dir_all(data_path)?;

    Ok(())
}

// pub fn create_folder(path: &str) -> io::Result<()> {
//     let data_path = Path::new(path);

//     // Créer le dossier
//     fs::create_dir_all(data_path)?;

//     Ok(())
// }

pub fn remove_folder(path: &str) -> io::Result<()> {
    let data_path = Path::new(path);

    // Supprimer le dossier s'il existe
    if data_path.exists() {
        fs::remove_dir_all(data_path)?;
    }

    Ok(())
}

pub fn copy_files_in_folder(path: &str, path_output: &str) -> io::Result<()> {
    // move all files in folder_output dans le dossier path_output
    let files = fs::read_dir(path).unwrap();

    for file in files {
        let file = file.unwrap();

        let path = file.path();
        let path_str = path.to_str().unwrap();

        let file_name = file.file_name().to_os_string().into_string().unwrap();

        let path_output = format!("{}/{}", path_output, file_name);

        fs::copy(path_str, path_output)?;
    }

    Ok(())
}
