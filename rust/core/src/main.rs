mod processing;
mod utils;

use processing::process_files;
use utils::args::Args;
use utils::help::display_help;

fn main() {
    use std::time::Instant;
    let now = Instant::now();

    let args: Vec<String> = std::env::args().collect();

    if args.contains(&"-h".to_string()) || args.contains(&"--help".to_string()) {
        display_help();
    } else {
        match Args::parse(&args) {
            Ok(parsed_args) => {
                if let Err(e) = process_files(&parsed_args) {
                    eprintln!("Erreur lors du traitement: {}", e);
                }
            }
            Err(e) => {
                eprintln!("Erreur: {}", e);
                display_help();
            }
        }
    }

    let elapsed = now.elapsed();
    println!("{{\"elapsed\":{}}}", elapsed.as_secs_f32());
}
