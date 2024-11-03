use std::error::Error;

pub struct Args {
    pub folder_pdf: String,
    pub folder_output: String,
    pub nb_page: usize,
}

impl Args {
    pub fn parse(args: &[String]) -> Result<Self, Box<dyn Error>> {
        let mut folder_pdf = String::new();
        let mut folder_output = String::new();
        let mut nb_page = 0;

        let mut iter = args.iter().peekable();
        while let Some(arg) = iter.next() {
            match arg.as_str() {
                "-f" => {
                    if let Some(value) = iter.peek() {
                        folder_pdf = value.to_string();
                        iter.next();
                    } else {
                        return Err("L'option -f nécessite un chemin de fichier PDF.".into());
                    }
                }
                "-o" => {
                    if let Some(value) = iter.peek() {
                        folder_output = value.to_string();
                        iter.next();
                    } else {
                        return Err("L'option -o nécessite un chemin de dossier de sortie.".into());
                    }
                }
                "-n" => {
                    if let Some(value) = iter.peek() {
                        nb_page = value.parse::<usize>()?;
                        iter.next();
                    } else {
                        return Err("L'option -n nécessite un nombre de pages.".into());
                    }
                }
                _ => {}
            }
        }

        if folder_pdf.is_empty() || folder_output.is_empty() || nb_page == 0 {
            return Err("Arguments manquants. Utilisez -h ou --help pour l'aide.".into());
        }

        Ok(Args {
            folder_pdf,
            folder_output,
            nb_page,
        })
    }
}
