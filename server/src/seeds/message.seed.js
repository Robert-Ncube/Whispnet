import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import Message from "../models/message.model.js";

config();

const seedMessages = async () => {
  try {
    await connectDB();

    const result = await Message.updateMany(
      { read: { $exists: false } },
      { $set: { read: false } }
    );

    console.log(`✅ Seed complete: ${result.modifiedCount} messages updated.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding messages:", error);
    process.exit(1);
  }
};

seedMessages();
