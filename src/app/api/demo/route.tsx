export async function GET(req: Request) {

    const userId = req.headers.get("user-id");
    const role = req.headers.get("user-role");

    
  if (!userId || !role) {
    return Response.json(
      { msg: "Unauthorized" },
      { status: 401 }
    );
  }

    console.log(userId + role)
    return Response.json({
        msg: "valid route",
        userId,
        role
    })
}