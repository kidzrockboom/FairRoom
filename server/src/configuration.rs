use config::Config;

#[derive(serde::Deserialize)]
pub struct Settings {
    pub database: DatabaseSettings,
    pub server: Server,
}

#[derive(serde::Deserialize)]
pub struct Server {
    pub application_port: u16,
    pub address: String,
}

#[derive(serde::Deserialize)]
pub struct DatabaseSettings {
    pub username: String,
    pub password: String,
    pub port: u16,
    pub host: String,
    pub database_name: String,
}

impl DatabaseSettings {
    pub fn get_connection_string(&self) -> String {
        format!(
            "postgres://{}:{}@{}:{}/{}",
            self.username, self.password, self.host, self.port, self.database_name
        )
    }
}

pub fn get_configuration() -> Result<Settings, config::ConfigError> {
    // Initialize configuration Reader
    let settings = Config::builder()
        .add_source(config::File::with_name("./settings/configuration")) // Read settings from file
        .build()
        .unwrap();

    // Deserialize the config object into Settings struct
    let settings: Settings = settings.try_deserialize().unwrap();

    Ok(settings)
}
