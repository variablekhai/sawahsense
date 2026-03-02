import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(request: Request) {
  try {
    const {
      recipientName,
      phoneNumber,
      fieldName,
      alertMessage,
      eviValue,
      ndviValue,
      stage,
      dayNum,
    } = await request.json();

    if (!phoneNumber || !recipientName || !fieldName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Format the WhatsApp message
    const messageBody = `${recipientName}, sila pergi semak ${fieldName} hari ini. ${alertMessage || ""} Fokus kawasan yang menunjukkan perubahan terbesar.\n\n📊 EVI: ${eviValue || "N/A"} | NDVI: ${ndviValue || "N/A"}\n🗓 Peringkat: ${stage || "N/A"}, Hari ${dayNum || "N/A"}\n\n— SawahSense 🌾`;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

    // For demo/test mode, just return success
    if (
      !accountSid ||
      accountSid === "test" ||
      !authToken ||
      authToken === "test"
    ) {
      console.log("[Demo] WhatsApp message would be sent to:", phoneNumber);
      console.log("[Demo] Message:", messageBody);
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Demo mode - message simulated",
        recipient: phoneNumber,
      });
    }

    const client = twilio(accountSid, authToken);
    const to = phoneNumber.startsWith("whatsapp:")
      ? phoneNumber
      : `whatsapp:${phoneNumber}`;

    const message = await client.messages.create({
      from,
      to,
      body: messageBody,
    });

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("WhatsApp send error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send message" },
      { status: 500 },
    );
  }
}
