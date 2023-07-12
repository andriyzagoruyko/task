export declare class ConfigService {
    httpPort: number;
    database: {
        host: string;
        port: number;
        user: string;
        pass: string;
        name: string;
        maxConnections: string | number;
        ssl: boolean;
    };
}
