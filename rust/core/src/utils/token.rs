use rand::Rng;

pub fn token_generator() -> String {
    format!("{:x}", rand::thread_rng().gen::<u32>())
}