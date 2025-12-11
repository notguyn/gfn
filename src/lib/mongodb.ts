import { type Connection, connect } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI || "";

if (!MONGODB_URI)
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local",
	);

let cachedConnention: Connection | null = null;

export default async function connectToDatabase() {
	if (cachedConnention) return cachedConnention;

	try {
		const conn = await connect(MONGODB_URI);
		cachedConnention = conn.connection;
		return cachedConnention;
	} catch (error) {
		throw new Error(`Unable to connect to database: ${error}`);
	}
}
