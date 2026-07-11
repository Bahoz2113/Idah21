import { config } from "dotenv";
import { resolve } from "node:path";
// seed packages/database içinden çalışır -> kök .env'i yükle
config({ path: resolve(process.cwd(), "../../.env") });
