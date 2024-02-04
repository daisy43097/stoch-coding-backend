import "reflect-metadata"
import {DataSource, DataSourceOptions} from "typeorm"
import {SeederOptions} from "typeorm-extension";

const options: DataSourceOptions & SeederOptions = {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "chengxin123",
    database: "backend-prep",
    synchronize: false,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    seeds: ["src/db/seeds/**/*{.ts,.js}"],
    factories: ["src/db/factories/**/*{.ts,.js}"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
}

export const AppDataSource = new DataSource(options)
