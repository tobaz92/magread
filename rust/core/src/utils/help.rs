pub fn display_help() {
    println!("Usage: magread [OPTIONS]");
    println!("Options:");
    println!("    -h, --help    Affiche ce message d'aide");
    println!("    -f            Chemin du fichier PDF");
    println!("    -o            Chemin du dossier de sortie");
    println!("    -n            Nombre de pages à traiter");
    std::process::exit(0);
}
