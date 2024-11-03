pub fn display_help() {
    println!("Usage: magread [OPTIONS]");
    println!("Options:");
    println!("    -h, --help    Affiche ce message d'aide");
    println!("    -f            Dossier d'entrée");
    println!("    -webp         Compresse les images en webp");
    std::process::exit(0);
}
