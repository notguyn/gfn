import connectToDatabase from "./lib/mongodb";

export async function register() {
	await connectToDatabase();
}
