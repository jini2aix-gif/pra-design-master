
import { NextResponse } from 'next/server';

const DOWNLOAD_PASSWORD = "전장시스템설계파트";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (password === DOWNLOAD_PASSWORD) {
            return NextResponse.json({ success: true, message: "Authorized" });
        } else {
            return NextResponse.json({ success: false, message: "Invalid Password" }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Request error" }, { status: 400 });
    }
}
