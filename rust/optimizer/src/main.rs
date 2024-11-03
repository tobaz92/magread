mod utils;
use crate::utils::compress_jpg::compress_jpg_function;

fn main() {
    use std::time::Instant;
    let now = Instant::now();

    let args: Vec<String> = std::env::args().collect();

    if args.len() == 1 {
        utils::help::display_help();
    }

    if args[1] == "-f" {
        let input_folder = &args[2];
        compress_jpg_function(input_folder);
    }

    let elapsed = now.elapsed();
    println!("{{\"elapsed\":{}}}", elapsed.as_secs_f32());
}
