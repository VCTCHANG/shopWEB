import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabase } from "@/lib/supabase";

// PATCH /api/cart/[productId] — 更新數量
export async function PATCH(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { quantity } = await req.json();
  const productId = params.productId;

  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", session.user.id)
    .eq("product_id", String(productId));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/cart/[productId] — 刪除單一商品
export async function DELETE(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = params.productId;

  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", session.user.id)
    .eq("product_id", String(productId));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
